import express from "express";
import { SubscriptionController } from "../controllers/subscription.controller";

const router = express.Router();

router.post("/", SubscriptionController.subscribe);

export default router;
