import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.post("/verify", IssuanceController.verify);
router.get("/issuers", IssuanceController.issuers);
router.post(
  "/credentia_types",
  authenticateToken,
  IssuanceController.credentialTypes
);
router.post("/credentials", authenticateToken, IssuanceController.credentials);

export default router;
