import { NextFunction, Request, Response } from "express";
import { ApiService } from "../services/api.service";

export class ApiController {
    static async generateApiKey(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const authHeader = req.headers.authorization;
        let token = null;
    
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    
        if (!token) {
            res.status(401).json({
                status: "error",
                message: "Unauthorized",
            });
        }
        else {
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
        }
        } catch (e) {
            next(e);
        }
    }
};