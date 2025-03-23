import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.post("/address/user", authenticateToken, IssuanceController.retrieve);
router.post("/verify", IssuanceController.verify);
router.get("/issuers", IssuanceController.issuers);
router.post(
  "/credential_types",
  authenticateToken,
  IssuanceController.credentialTypes
);
router.post("/credentials", authenticateToken, IssuanceController.credentials);
router.patch("/credentials/:id", authenticateToken, IssuanceController.update);
router.post(
  "/credential-queue",
  authenticateToken,
  IssuanceController.getPendingCredentialTypes
);

export default router;
