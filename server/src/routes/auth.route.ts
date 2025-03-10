import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/user", authenticateToken, AuthController.getUser);

export default router;
