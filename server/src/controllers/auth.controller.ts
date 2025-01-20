import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const success = await AuthService.loginUser(email, password);

    if (success) {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    } else {
      res.json({
        status: "success",
        data: {},
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const success = await AuthService.registerUser(email, password);

    if (success) {
      res.status(400).json({
        status: "error",
        message: "Unable to register user",
      });
    } else {
      res.status(201).json({
        status: "success",
        data: {},
      });
    }
  }
}
