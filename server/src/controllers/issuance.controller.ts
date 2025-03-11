import { NextFunction, Request, Response } from "express";
import { IssuanceService } from "../services/issuance.service";
import { SchemaValidationUtil } from "../utils/schema_validation.util";
import { AuthService } from "../services/auth.service";
import { HolderModel } from "../models/holder.model";

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

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      SchemaValidationUtil.updateCredentialSchema.parse(req.body);
      const { hidden } = req.body;

      const { id } = req.params;

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

      console.log("TOKEN PROVIDED");

      const user = await AuthService.getUser(token);

      if (!user) {
        res.status(401).json({
          status: "error",
          message: "Invalid token",
        });
        return;
      }
      console.log("TOKEN VALID");
      
      const credential = await IssuanceService.getCredential(parseInt(id));
      const holder = await HolderModel.findHolderByUserId(user.id);

      console.log("CREDENTIAL", credential);
      console.log("USER", user);
      console.log("HOLDER", holder);
      if (credential.holder_id !== holder.id) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
        return;
      }
      console.log("RIGHT USER");

      await IssuanceService.updateCredential(parseInt(id), hidden);

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      next(err);
    }
  }
}
