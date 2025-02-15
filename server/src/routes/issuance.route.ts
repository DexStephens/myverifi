import express from "express";
import { IssuanceController } from "../controllers/issuance.controller";
import { upload } from "../config/multer.config";
const router = express.Router();

router.put("/address", IssuanceController.address);
router.post("/:id/response", IssuanceController.respond);
router.post("/", upload.single("file"), IssuanceController.create);

export default router;
