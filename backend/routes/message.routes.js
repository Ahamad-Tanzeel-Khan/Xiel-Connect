import express from "express";
import { deleteMessage, deleteMessagesForUser, getMessages, markMessagesAsRead, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:conversationId", protectRoute, sendMessage);
router.post("/delete-for-user/:chatRoomId", protectRoute, deleteMessagesForUser);
router.delete("/delete/:messageId", protectRoute, deleteMessage);
router.post("/markAsRead", protectRoute, markMessagesAsRead);

export default router;