import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ],
    lastMessage: {
        text: { type: String, default: "" },
        type: { type: String, default: "text" }, // e.g., "text", "image", "file", "audio"
        timestamp: { type: Date, default: Date.now }
    },
    isChannel : {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;