import { NextFunction, Request, Response } from "express";
import { ApiService } from "../services/api.service";
import { AuthUtils } from "../utils/auth.utils";

export class ApiController {
    static async generateApiKey(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token = AuthUtils.getTokenFromHeader(req);
            if (!token){
                res.status(401).json({ status: "error", message: "Unauthorized" });
                return;
            } 
            
            const apiKey = await ApiService.generateApiKey(token);
            if (!apiKey) {
                res.status(500).json({
                    status: "error",
                    message: "Failed to generate API key",
                });
                return;
            }

            res.json({
                status: "success",
                apiKey,
            });
        } catch (e) {
            next(e);
        }
    }

    static async revokeApiKey(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token = AuthUtils.getTokenFromHeader(req);
            if (!token){
                res.status(401).json({ status: "error", message: "Unauthorized" });
                return;
            } 
            const success = await ApiService.revokeApiKey(token);

            if (!success) {
                res.status(500).json({
                    status: "error",
                    message: "Failed to revoke API key",
                });
                return;
            }

            res.json({
                status: "success",
                message: "API key revoked successfully",
            });
        } catch (e) {
            next(e);
        }
    }
};