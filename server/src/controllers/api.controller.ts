import { NextFunction, Request, Response } from "express";
import { ApiService } from "../services/api.service";
import { AuthUtils } from "../utils/auth.utils";

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
};