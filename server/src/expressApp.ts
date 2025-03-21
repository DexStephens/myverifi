import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.route";
import apiRoutes from "./routes/api.route";
import issuanceRoutes from "./routes/issuance.route";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { stringify } from "bigint-json";
import { ControllerError, ErrorUtil } from "./utils/error.util";
import { ZodError } from "zod";

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
app.use("/api", apiRoutes);

//Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ControllerError) {
    res.status(400).json({
      status: "error",
      error: {
        title: err.title,
        message: err.message,
      },
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      error: ErrorUtil.parseZodMessage(err.message),
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

export default app;
