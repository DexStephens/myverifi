import { IssuerModel } from "../models/issuer.model";
import { AuthUtils } from "../utils/auth.utils";
import { AuthService } from "./auth.service";
import { randomBytes } from "crypto";

export class ApiService {
    static async generateApiKey(userId: number) {
        try {
            const apiKey = randomBytes(32).toString("hex");
            const hashedApiKey =  await AuthUtils.hashPassword(apiKey);

            const success = await IssuerModel.setApiKey(userId, hashedApiKey);
            if (!success) {
                throw new Error("Failed to set API key");
            }

            return apiKey;
        } catch (error) {
            console.error("Error generating API key for user:", userId, error);
            throw new Error("Failed to generate API key");
        }
    }

    static async revokeApiKey(userId: number) {
        try {
            const success = await IssuerModel.setApiKey(userId, null);
            if (!success) {
                throw new Error("Failed to revoke API key");
            }
        } catch (error) {
            console.error("Error generating API key for user:", userId, error);
            throw new Error("Failed to revoke API key");
        }
    }
};