import express, { Router } from "express"
import protectRoute from "../middlewares/protectRoute.js";
import { getUsersForSidebar } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar)

export default router;