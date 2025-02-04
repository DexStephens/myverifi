import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";

export class AuthController {
  static async webLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      SchemaValidationUtil.LoginSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: JSON.parse(e.message),
      });
      return;
    }

    const user = await AuthService.loginWebUser(email, password);

    if (user) {
      res.json({
        status: "success",
        data: {
          user,
        },
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    }
  }

  static async webRegister(req: Request, res: Response): Promise<void> {
    const {
      email,
      password,
      title,
      street_address,
      city,
      state,
      zip,
      country,
      phone,
    } = req.body;

    console.log(req.body);

    try {
      SchemaValidationUtil.WebRegisterSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: JSON.parse(e.message),
      });
      return;
    }

    const success = await AuthService.registerWebUser(
      email,
      password,
      title,
      street_address,
      city,
      state,
      zip,
      country,
      phone
    );

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

  static async walletLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      SchemaValidationUtil.LoginSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        errors: JSON.parse(e.message),
      });
      return;
    }

    const user = await AuthService.loginWalletUser(email, password);

    if (user) {
      res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    }
  }

  static async walletRegister(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      SchemaValidationUtil.WalletRegisterSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: JSON.parse(e.message),
      });
      return;
    }

    const success = await AuthService.registerWalletUser(email, password);

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
