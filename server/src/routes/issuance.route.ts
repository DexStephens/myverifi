import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.put("/address", authenticateToken, IssuanceController.address);
router.post("/verify", IssuanceController.verify);
router.get("/issuers", IssuanceController.issuers);

export default router;
