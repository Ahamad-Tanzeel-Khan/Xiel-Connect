import express, { Router } from "express"
import protectRoute from "../middlewares/protectRoute.js";
import { getFavoriteConversations, toggleFavoriteConversation } from "../controllers/favorite.controller.js";

const router = express.Router();

router.put('/favorite/:conversationId', protectRoute, toggleFavoriteConversation);

router.get("/favorites", protectRoute, getFavoriteConversations);

export default router;