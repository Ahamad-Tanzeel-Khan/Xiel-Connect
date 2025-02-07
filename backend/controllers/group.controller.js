import Conversation from "../models/conversation.model.js";

export const createGroupConversation = async (req, res) => {
    try {
        const { groupName, participants, icon } = req.body;
        const userId = req.user._id;

        if (!participants.includes(userId.toString())) {
            participants.push(userId);
        }

        const conversation = await Conversation.create({
            isGroup: true,
            groupName,
            participants,
            icon,
            admin: [userId],
        });

        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating group conversation:", error);
        res.status(500).json({ error: "Failed to create group conversation" });
    }
};