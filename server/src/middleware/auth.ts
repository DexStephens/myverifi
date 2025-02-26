import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {  // Explicitly return void
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return; // Ensure the function exits after sending a response
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return; // Exit the function after sending a response
    }

    req.user = decoded as jwt.JwtPayload; // Explicitly type `req.user`
    next(); // Ensure `next()` is called
  });
};
