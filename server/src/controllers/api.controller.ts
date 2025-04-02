import { NextFunction, Request, Response } from "express";
import { ApiService } from "../services/api.service";
import { IssuanceService } from "../services/issuance.service";

export class ApiController {
    static async generateApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const apiKey = await ApiService.generateApiKey(req.user.id);
            res.json({ status: "success", apiKey });
        } catch (e) {
            next(e);
        }
    }

    static async revokeApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await ApiService.revokeApiKey(req.user.id);
            res.json({ status: "success", message: "API key revoked successfully" });
        } catch (e) {
            next(e);
        }
    }

    static async listCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const credentials = await ApiService.listCredentials(req.user.id); // this is actually issuer id
          res.json({ status: "success", credentials });
        } catch (e) {
          next(e);
        }
    }

    static async createCredential(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, attributes } = req.body;

            if (!title) {
                res.status(400).json({ error: "Credential title is required" });
                return;
            }

             // this is actually issuer id
            const credential = await IssuanceService.createCredentialTypeApi(req.user.id, title, attributes);
            
            res.json({ status: "success", credential });
        } catch (e) {
            next(e);
        }
    }

    static async issue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, credentialId } = req.body;

            if (!email) {
                res.status(400).json({ error: "Email is required" });
                return;
            }

            if (!credentialId) {
                res.status(400).json({ error: "Credential ID is required" });
                return;
            }

            const issuance = await IssuanceService.issueCredentialApi(req.user.id, email, credentialId);
            res.json({ status: "success", issuance });
        } catch (e) {
            next(e);
        }
    }

    static async getCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({ error: "Email is required" });
                return;
            }

            const credentials = await IssuanceService.getCredentialsApi(email);
            res.json({ status: "success", credentials });
        } catch (e) {
            next(e);
        }
    }
};