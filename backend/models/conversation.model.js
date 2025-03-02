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
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        text: { type: String, default: "" },
        type: { type: String, default: "text" },
        timestamp: { type: Date, default: Date.now }
    },
    isChannel : {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;