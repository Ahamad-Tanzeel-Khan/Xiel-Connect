import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createGroupConversation } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroupConversation);

export default router;