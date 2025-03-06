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
          result,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async retrieve(req: Request, res: Response, next: NextFunction) {
    try {
      SchemaValidationUtil.retrieveAddressSchema.parse(req.body);

      const { email } = req.body;

      const address = await IssuanceService.retrieveAddress(email);

      res.status(200).json({
        status: "success",
        data: {
          address,
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
      SchemaValidationUtil.createCredentialSchema.parse(req.body);

      const { email, title, cid } = req.body;

      await IssuanceService.createCredentialType(email, title, cid);

      res.status(201).json({
        status: "success",
      });
    } catch (err) {
      next(err);
    }
  }

  static async credentials(req: Request, res: Response, next: NextFunction) {
    try {
      SchemaValidationUtil.issueCredentialSchema.parse(req.body);

      const { emails, credential_id } = req.body;

      const issued = await IssuanceService.issueCredential(
        emails,
        credential_id
      );

      res.status(201).json({
        status: "success",
        data: {
          issued,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
