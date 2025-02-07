import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function() { return this.chatRoomType === 'Conversation'; }
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "chatRoomType",
        required: true,
    },
    chatRoomType: {
        type: String,
        enum: ["conversation", "channel"], 
        required: true,
    },
    message: {
        type: String,
        default: "" 
    },
    originalFileName: {
        type: String,
        default: "" 
    },
    mediaUrl: {
        type: String,
        default: "" 
    },
    mediaType: {
        type: String, 
        enum: ['image', 'video', 'audio', 'application', ''],
        default: ''
    },
    type: {
        type: String,
        enum: ['text', 'system', 'file', 'image'],
        default: 'text',
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

messageSchema.index({ chatRoom: 1, chatRoomType: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
