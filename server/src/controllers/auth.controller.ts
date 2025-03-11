import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";

export class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      SchemaValidationUtil.LoginSchema.parse(req.body);

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

  static async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      let token = null;
  
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }

      if (!token) {
        res.status(401).json({
          status: "error",
          message: "Bearer token not provided",
        });
        return;
      }

      const user = await AuthService.getUser(token);

      if (user) {
        res.json({
          status: "success",
          data: user,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Bearer token not valid",
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
