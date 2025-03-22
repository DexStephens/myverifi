import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired, please log in again" });
      } else {
        res.status(403).json({ error: "Invalid token" });
      }
      return;
    }

    req.user = decoded as jwt.JwtPayload;
    next();
  });
};
