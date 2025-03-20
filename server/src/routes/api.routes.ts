import express from "express";
import { authenticateToken } from "../middleware/auth";
import { ApiController } from "../controllers/api.controller";
const router = express.Router();

router.post("/generate-apikey", authenticateToken, ApiController.generateApiKey);

export default router;
