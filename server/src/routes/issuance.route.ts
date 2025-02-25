import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.put("/address", authenticateToken, IssuanceController.address); // example if we wanted this route to be protected by a JWT
router.post("/verify", IssuanceController.verify);
router.get("/issuers", IssuanceController.issuers);


export default router;
