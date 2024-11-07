import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getUserConversations } from "../controllers/conversations.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserConversations);

export default router;