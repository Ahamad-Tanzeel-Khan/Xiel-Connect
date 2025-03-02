import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import crypto from "crypto";
import { getReceiverSocketId, getSenderSocketId, io } from "../socket/socket.js";


const generateInviteLink = () => {
    return crypto.randomBytes(6).toString("hex"); 
};

// Create a new channel

export const createChannel = async (req, res) => {
    try {
        const { name, description, participants, icon } = req.body;
        const creatorId = req.user.id;      

        const inviteLink = generateInviteLink();

        const channel = new Channel({
            name,
            description,
            creatorId,
            admin: [creatorId],
            participants: [...participants, creatorId],
            icon,
            inviteLink,
        });

        await channel.save();

        channel.participants.forEach((participant) => {
            const socketId = getReceiverSocketId(participant._id);
            if (socketId) {
                io.to(socketId).emit("newChannel", channel);
            }
        });

        return res.status(201).json({ message: "Channel created successfully", channel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// Get all channels
export const getAllChannels = async (req, res) => {
    try {
        const userId = req.user.id;

        const channels = await Channel.find({
            $or: [
                { participants: userId },
            ]
        }).sort({ "lastMessage.timestamp": -1 })
        .populate({
            path: 'participants',
            select: 'fullname username profilePic'
        })
        .populate('lastMessage')
        .populate({
            path: 'creatorId',
            select: 'fullname username profilePic'
        });
        res.status(200).json(channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve channels." });
    }
};

// Get a specific channel
export const getChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findById(channelId).populate("creatorId participants", "name email");
        if (!channel) {
            return res.status(404).json({ error: "Channel not found." });
        }

        res.status(200).json(channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve channel." });
    }
};

// Join a channel
export const joinChannel= async (req, res) => {
    try {
        const { inviteLink } = req.params;
        const userId = req.user.id;

        const channel = await Channel.findOne({ inviteLink });

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        if (channel.participants.includes(userId)) {
            return res.status(400).json({ error: "You are already a member of this channel" });
        }

        channel.participants.push(userId);
        await channel.save();

        return res.status(200).json({ message: "Joined channel successfully", channel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error", error });
    }
};



// Leave a channel
export const leaveChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user.id;

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: "Channel not found." });
        }

        channel.participants = channel.participants.filter(id => !id.equals(userId));

        await channel.save();

        console.log("User left the channel:", userId);
        res.status(200).json({ message: "Left channel successfully.", channel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to leave channel." });
    }
};


// Delete a channel
export const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user.id;

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({ error: "Channel not found." });
        }

        if (!channel.creatorId.equals(userId)) {
            return res.status(403).json({ error: "User does not have permission to delete this channel." });
        }

        await Message.deleteMany({ chatRoom: channelId, chatRoomType: "Channel" });

        await Channel.findByIdAndDelete(channelId);

        return res.status(200).json({ message: "Channel deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete channel." });
    }
};