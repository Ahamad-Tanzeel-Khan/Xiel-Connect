import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const toggleFavoriteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const user = await User.findById(req.user._id);

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const isFavorite = user.favorites.includes(conversationId);

        if (isFavorite) {
            user.favorites.pull(conversationId);
        } else {
            user.favorites.push(conversationId);
        }

        await user.save();

        res.status(200).json({
            favorites: user.favorites,
            message: isFavorite ? "Removed from favorites" : "Added to favorites"
        });

    } catch (error) {
        console.log("Error in toggleFavoriteConversation:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getFavoriteConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'favorites',
            populate: {
                path: 'participants',
                select: 'fullname username profilePic'
            }
        });

        if (!user || !user.favorites) {
            return res.status(200).json([]);
        }

        res.status(200).json(user.favorites);

    } catch (error) {
        console.log("Error in getFavoriteConversations controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};