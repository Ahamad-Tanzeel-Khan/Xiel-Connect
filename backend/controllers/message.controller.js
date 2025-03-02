import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, getSenderSocketId, io } from "../socket/socket.js";
import Channel from "../models/channel.model.js";


export const sendMessage = async (req, res) => {
    try {
        const { message, mediaUrl, mediaType, originalFileName, chatRoomType } = req.body;
        const senderId = req.user._id;
        const { conversationId } = req.params;

        let chatRoom;
        let NewlyCreatedConversation = false;

        if (chatRoomType === "channel") {
            chatRoom = await Channel.findOne({ _id: conversationId });

        } else {
            chatRoom = await Conversation.findOne({
                participants: { $all: [senderId, conversationId], $size: 2 }
            });

            if (!chatRoom) {
                chatRoom = await Conversation.create({
                    participants: [senderId, conversationId]
                });

                NewlyCreatedConversation = true;
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId: conversationId,
            chatRoomType: chatRoomType,
            chatRoom: chatRoom._id,
            message,
            originalFileName,
            mediaUrl,
            mediaType,
        });

        chatRoom.lastMessage = {
            _id: newMessage._id,
            text: mediaType ? mediaType : message.substring(0, 17),
            type: mediaType ? mediaType : "text",
            timestamp: new Date(),
        };

        chatRoom.messages.push(newMessage._id);
        await Promise.all([chatRoom.save(), newMessage.save()]);

        if (NewlyCreatedConversation) {
            chatRoom = await chatRoom.populate('participants', 'username profilePic');

            const receiverSocketId = getReceiverSocketId(conversationId);
            // const senderSocketId = getSenderSocketId(senderId);
            // if (senderSocketId) io.to(senderSocketId).emit("newConversation", chatRoom);
            if (receiverSocketId) io.to(receiverSocketId).emit("newConversation", chatRoom);
        }

        // Broadcast to all channel members
        if (chatRoomType === "channel") {
            chatRoom.participants.forEach((participantId) => {
                const socketId = getReceiverSocketId(participantId.toString());
                if (socketId) {
                    io.to(socketId).emit("newMessage", newMessage);
                    io.to(socketId).emit("conversationUpdate", {
                        conversationId: chatRoom._id,
                        lastMessage: chatRoom.lastMessage,
                        chatRoomType,
                    });
                }
            });
        }
        else {
            //  Normal private chat message sending
            const receiverSocketId = getReceiverSocketId(conversationId);
            const senderSocketId = getSenderSocketId(senderId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            io.to([senderSocketId, receiverSocketId]).emit("conversationUpdate", {
                conversationId: chatRoom._id,
                lastMessage: chatRoom.lastMessage,
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: chatRoomId } = req.params;
        const senderId = req.user._id;
        const isChannel = req.query.isChannel === 'true';
        let chatRoom;

        if (isChannel) {
            chatRoom = await Channel.findOne({
                _id: chatRoomId,
                participants: { $all: [senderId] }
            }).populate("messages");

        } else {
            chatRoom = await Conversation.findOne({
                _id: chatRoomId,
                participants: { $all: [senderId] }
            }).populate("messages");
        }

        if (!chatRoom) return res.status(200).json([]);

        res.status(200).json(chatRoom.messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const deleteMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
  
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found", params: messageId });
      }
  
      if (message.chatRoomType === 'channel') {
        await Channel.updateOne(
          { _id: message.chatRoom },
          { $pull: { messages: messageId } }
        );
  
        const channel = await Channel.findById(message.chatRoom).populate("messages");
  
        if (channel) {
          channel.participants.forEach((participantId) => {
            const socketId = getReceiverSocketId(participantId.toString());
            if (socketId) {
              io.to(socketId).emit("messageDeleted", messageId);
            }
          });
  
          if (channel.lastMessage && channel.lastMessage._id && channel.lastMessage._id.toString() === messageId.toString()) {
            const newLastMessageDoc = await Message.findOne({ chatRoom: channel._id }).sort({ createdAt: -1 });
            channel.lastMessage = newLastMessageDoc ? {
              _id: newLastMessageDoc._id,
              text: newLastMessageDoc.message,
              type: newLastMessageDoc.mediaType || "text",
              timestamp: newLastMessageDoc.createdAt,
            } : {};
            await channel.save();
            channel.participants.forEach((participantId) => {
              const socketId = getReceiverSocketId(participantId.toString());
              if (socketId) {
                io.to(socketId).emit("conversationUpdate", {
                  conversationId: channel._id,
                  lastMessage: channel.lastMessage,
                  chatRoomType: "channel"
                });
              }
            });
          }
        }
      } else {
        await Conversation.updateOne(
          { _id: message.chatRoom },
          { $pull: { messages: messageId } }
        );
  
        const conversation = await Conversation.findById(message.chatRoom).populate("messages");
        if (conversation) {
          conversation.participants.forEach((participantId) => {
            const socketId = getReceiverSocketId(participantId.toString());
            if (socketId) {
              io.to(socketId).emit("messageDeleted", messageId);
            }
          });
  
          if (conversation.lastMessage && conversation.lastMessage._id && conversation.lastMessage._id.toString() === messageId.toString()) {
            const newLastMessageDoc = await Message.findOne({ chatRoom: conversation._id }).sort({ createdAt: -1 });
            conversation.lastMessage = newLastMessageDoc ? {
              _id: newLastMessageDoc._id,
              text: newLastMessageDoc.message,
              type: newLastMessageDoc.mediaType || "text",
              timestamp: newLastMessageDoc.createdAt,
            } : {};
            await conversation.save();
            conversation.participants.forEach((participantId) => {
              const socketId = getReceiverSocketId(participantId.toString());
              if (socketId) {
                io.to(socketId).emit("conversationUpdate", {
                  conversationId: conversation._id,
                  lastMessage: conversation.lastMessage,
                });
              }
            });
          }
        }
      }
  
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error in deleteMessage controller:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


export const deleteMessagesForUser = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        const userId = req.user.id;
        const isChannel = req.query.isChannel === 'true';

        let conversation;

        if (isChannel) {
            conversation = await Channel.findById(chatRoomId);
        } else {
            conversation = await Conversation.findById(chatRoomId);
        }

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        const participants = conversation.participants;

        await Message.updateMany(
            { chatRoom: chatRoomId },
            { $addToSet: { deletedFor: userId } }
        );

        const messages = await Message.find({ chatRoom: chatRoomId });
        const messagesToDelete = messages.filter((message) =>
            participants.every((participantId) =>
                Array.isArray(message.deletedFor) && message.deletedFor.includes(participantId.toString())
            )
        );


        await Message.deleteMany({
            _id: { $in: messagesToDelete.map((msg) => msg._id) }
        });

        res.status(200).json({
            message: "Messages updated for user",
            deletedMessages: messagesToDelete.map((msg) => msg._id)
        });
    } catch (error) {
        console.error("Error in deleteMessagesForUser:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const markMessagesAsRead = async (req, res) => {
    try {
        const { conversationId, isChannel } = req.body;
        const userId = req.user._id
        let chatRoom;

        if (isChannel) {
            chatRoom = await Channel.findById(conversationId);
        } else {
            chatRoom = await Conversation.findById(conversationId);
        }

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const updatedMessages = await Message.updateMany(
            { chatRoom: conversationId, readBy: { $ne: userId } },
            { $push: { readBy: userId } }
        );

        res.json({ success: true, updatedMessages });
    } catch (error) {
        res.status(500).json({ error: 'Error marking messages as read' });
    }
};
