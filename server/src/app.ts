import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.route";
import issuanceRoutes from "./routes/issuance.route";
import subscriptionRoutes from "./routes/subscription.route";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import webPush from "web-push";

dotenv.config();

const app = express();

//Push Manager Setup
const VAPID_PUBLIC = process.env.VAPID_PUBLIC;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

webPush.setGCMAPIKey(process.env.GCM_API_KEY);
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL_FROM}`,
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/issuances", issuanceRoutes);
app.use("/subscriptions", subscriptionRoutes);

//Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

export default app;
