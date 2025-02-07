import express from "express";
import protectRoute from "../middlewares/protectRoute.js";

import { createChannel, getAllChannels, getChannel, joinChannel, leaveChannel, deleteChannel, } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createChannel);
router.get("/get", protectRoute, getAllChannels);
router.get("/get/:channelId", protectRoute, getChannel); 
router.post("/join/:inviteLink", protectRoute, joinChannel); 
router.post("/leave/:channelId", protectRoute, leaveChannel);
router.delete("/delete/:channelId", protectRoute, deleteChannel);

export default router;