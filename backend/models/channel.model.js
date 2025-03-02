import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    icon:{
        type: String,
        default: ""
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inviteLink: {
        type: String,
        unique: true, 
    },
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        }
    ],
    lastMessage: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        text: { type: String, default: "" },
        type: { type: String, default: "text" }, // e.g., "text", "image", "file", "audio"
        timestamp: { type: Date, default: Date.now }
    },
    musicQueue: [
        {
            url: { type: String, required: true }, // Music URL (e.g., Spotify, YouTube)
            title: { type: String, default: "" },
            addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        }
    ],
    isChannel : {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
