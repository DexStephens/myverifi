import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/web_login", AuthController.webLogin);
router.post("/web_register", AuthController.webRegister);
router.post("/wallet_login", AuthController.walletLogin);
router.post("/wallet_register", AuthController.walletRegister);

export default router;
