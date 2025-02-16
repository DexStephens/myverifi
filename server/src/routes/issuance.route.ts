import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
const router = express.Router();

router.put("/address", IssuanceController.address);

export default router;
