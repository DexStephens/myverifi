import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";
import { AuthUtils } from "../utils/auth.utils";

export class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = SchemaValidationUtil.LoginSchema.parse(req.body);

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
    } catch (e) {
      next(e);
    }
  }

  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      SchemaValidationUtil.RegisterSchema.parse(req.body);
      const { email, password, name } = req.body;

      const data = await AuthService.registerUser(email, password, name);

      res.status(201).json({
        status: "success",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = AuthUtils.getTokenFromHeader(req);
        if (!token) {
          res.status(401).json({ status: "error", message: "Bearer token not provided" });
          return;
        }

        const user = await AuthService.getUser(token);
        if (!user) {
          res.status(404).json({ status: "error", message: "Invalid token" });
          return;
        }

        res.json({ status: "success", data: user });
    } catch (err) {
        next(err);
    }
  }
}
