import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import expressFormidable from 'express-formidable';
import { uploadFile } from '../controllers/upload.controller.js';

const router = express.Router();

router.post("/", protectRoute, expressFormidable({maxFieldsSize: 5 * 1024 * 1024}), uploadFile)

export default router;
