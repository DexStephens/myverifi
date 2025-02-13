import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      SchemaValidationUtil.LoginSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: JSON.parse(e.message),
      });
      return;
    }

    const { email, password } = req.body;

    const user = await AuthService.loginUser(email, password);

    if (user) {
      res.json({
        status: "success",
        data: user,
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      SchemaValidationUtil.RegisterSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: JSON.parse(e.message),
      });
      return;
    }

    const { email, password, address, issuer } = req.body;

    const data = await AuthService.registerUser(
      email,
      password,
      issuer,
      address
    );

    if (data !== null) {
      res.status(201).json({
        status: "success",
        data,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Unable to register user",
      });
    }
  }
}
