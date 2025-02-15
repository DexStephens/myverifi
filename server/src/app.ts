import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.route";
import issuanceRoutes from "./routes/issuance.route";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { stringify } from "bigint-json";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (body) {
    return originalJson.call(this, JSON.parse(stringify(body))); // Custom serialization for bigint handling in responses
  };
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/issuances", issuanceRoutes);

//Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

export default app;
