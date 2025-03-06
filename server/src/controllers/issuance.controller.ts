import { NextFunction, Request, Response } from "express";
import { IssuanceService } from "../services/issuance.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";

export class IssuanceController {
  static async issuers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IssuanceService.issuers();

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      SchemaValidationUtil.verifyCredentialsSchema.parse(req.body);

      const { email, credential_types } = req.body;

      const result = await IssuanceService.verify(email, credential_types);

      res.status(200).json({
        status: "success",
        data: {
          valid: result,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async credentialTypes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //NEEDSWORK: this is where we will create a credential type with the gas manager

      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }

  static async credentials(req: Request, res: Response, next: NextFunction) {
    try {
      //NEEDSWORK: this is where we will issue credentials with the gas manager

      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }
}
