import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, getSenderSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, mediaUrl, mediaType, originalFileName } = req.body; 
        const senderId = req.user._id;
        const { conversationId } = req.params;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, conversationId]}
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, conversationId],
            })
        }

        const newMessage = new Message({
            senderId,
            recieverId: conversation.isGroup ? null : conversationId,
            chatRoom: conversation._id, 
            message,
            originalFileName,
            mediaUrl, 
            mediaType,
        });

        conversation.lastMessage = {
            text: mediaType ? mediaType : message.substring(0, 17),
            type: mediaType ? mediaType : "text",
            timestamp: new Date(),
        };
        


        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(conversationId);
        const senderSocketId = getSenderSocketId(senderId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        io.to([senderSocketId, receiverSocketId]).emit("conversationUpdate", {
            conversationId: conversation._id,
            lastMessage: conversation.lastMessage,
        });


        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { id: userOrGroupId } = req.params;
        const senderId = req.user._id;
        let conversation;

        if (req.query.isGroup === 'true') {
            conversation = await Conversation.findOne({
                _id: userOrGroupId,
                isGroup: true
            }).populate("messages");
        } else {
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, userOrGroupId] }
            }).populate("messages");
        }

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
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

        await Conversation.updateOne(
            { _id: message.chatRoom },
            { $pull: { messages: messageId } }
        );

        io.emit("messageDeleted", messageId);

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
        
        const conversation = await Conversation.findById(chatRoomId);
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
            participants.every((participantId) => message.deletedFor.includes(participantId.toString()))
        );

        await Message.deleteMany({
            _id: { $in: messagesToDelete.map((msg) => msg._id) }
        });

        res.status(200).json({ 
            message: "Messages updated for user", 
            deletedMessages: messagesToDelete.map((msg) => msg._id)  // Return IDs instead
        });
    } catch (error) {
        console.error("Error in deleteMessagesForUser:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const markMessagesAsRead = async (req, res) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id;

        // Update messages to add the userId to the readBy array
        await Message.updateMany(
            { chatRoom: conversationId, readBy: { $ne: userId } }, // Only update unread messages
            { $addToSet: { readBy: userId } } // Use $addToSet to avoid duplicates
        );

        // Optionally emit an event to notify the frontend
        io.emit("messagesRead", { conversationId, userId });

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
