import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const toggleFavoriteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;  // Conversation ID from the request
        const user = await User.findById(req.user._id);  // Find the current user

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the conversation is already in the favorites
        const isFavorite = user.favorites.includes(conversationId);

        if (isFavorite) {
            // If it's already a favorite, remove it
            user.favorites.pull(conversationId);
        } else {
            // Otherwise, add it to the favorites
            user.favorites.push(conversationId);
        }

        await user.save();  // Save the user's updated favorites

        res.status(200).json({
            favorites: user.favorites,  // Return the updated list of favorites
            message: isFavorite ? "Removed from favorites" : "Added to favorites"
        });

    } catch (error) {
        console.log("Error in toggleFavoriteConversation:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getFavoriteConversations = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current logged-in user

        // Find the user and populate their favorite conversations
        const user = await User.findById(userId).populate({
            path: 'favorites', // Populate the 'favorites' array with conversation data
            populate: {
                path: 'participants', // Also populate the participants inside each conversation
                select: 'fullname username profilePic' // Select relevant user fields
            }
        });

        // If user has no favorites, return an empty array
        if (!user || !user.favorites) {
            return res.status(200).json([]);
        }

        // Return the populated favorite conversations
        res.status(200).json(user.favorites);

    } catch (error) {
        console.log("Error in getFavoriteConversations controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};