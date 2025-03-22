import { NextFunction, Request, Response } from "express";
import { ApiService } from "../services/api.service";

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
};