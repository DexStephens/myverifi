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
      let issuer;
      if (name) {
        issuer = {
          name,
          contract_address: "",
        };
      }

      const data = await AuthService.registerUser(email, password, issuer);

      res.status(201).json({
        status: "success",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
