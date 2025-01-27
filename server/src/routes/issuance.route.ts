import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";

const router = express.Router();

router.post("/:id/response", IssuanceController.respond);
router.post("/", IssuanceController.create);

export default router;
