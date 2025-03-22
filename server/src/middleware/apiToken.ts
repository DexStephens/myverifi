// middleware/apiToken.ts
import { Request, Response, NextFunction } from "express";
import { IssuerModel } from "../models/issuer.model";
import { AuthUtils } from "../utils/auth.utils";

export const apiToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const hashedToken = AuthUtils.hashToken(token);
    const issuer = await IssuerModel.findByApiKey(hashedToken);

    if (!issuer) {
      res.status(403).json({ error: "Invalid API token" });
      return;
    }

    req.user = issuer; // Attach to request
    next();
  } catch (error) {
    console.error("API token middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
