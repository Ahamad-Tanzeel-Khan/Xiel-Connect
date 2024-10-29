import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, mediaUrl, mediaType, originalFileName } = req.body; 
        const senderId = req.user._id;
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const newMessage = new Message({
            senderId,
            recieverId: conversation.isGroup ? null : conversation.participants.find(p => p.toString() !== senderId.toString()),
            chatRoom: conversation._id, 
            message,
            originalFileName,
            mediaUrl, 
            mediaType,
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

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
            return res.status(404).json({ error: "Message not found" , params: messageId});
        }

        await Conversation.updateOne(
            { _id: message.chatRoom },
            { $pull: { messages: messageId } }
        );

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error in deleteMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



