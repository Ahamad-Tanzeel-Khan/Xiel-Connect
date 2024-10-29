import express from "express";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:conversationId", protectRoute, sendMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);

export default router;