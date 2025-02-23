import { NextFunction, Request, Response } from "express";
import { IssuanceService } from "../services/issuance.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";

export class IssuanceController {
  static async address(req: Request, res: Response, next: NextFunction) {
    try {
      SchemaValidationUtil.updateAddressSchema.parse(req.body);

      const { email, address } = req.body;

      await IssuanceService.address(email, address);

      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }

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
}
