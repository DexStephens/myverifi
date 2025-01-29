import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const success = await AuthService.loginUser(email, password);

    if (success) {
      res.json({
        status: "success",
        data: {},
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    console.log("Registering user", req.body);
    const { email } = req.body;

    const success = await AuthService.registerUser(email);

    if (success) {
      res.status(201).json({
        status: "success",
        data: {},
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Unable to register user",
      });
    }
  }
}
