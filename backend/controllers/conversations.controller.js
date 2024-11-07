import Conversation from "../models/conversation.model.js";

export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId
        })
        .sort({ "lastMessage.timestamp": -1 })
        .populate({
            path: 'participants',
            select: 'fullname username profilePic'
        })
        .populate('lastMessage');

        res.status(200).json(conversations);
    } catch (error) {
        console.log("Error in getUserConversations controller:", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
