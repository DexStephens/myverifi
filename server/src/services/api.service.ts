import { IssuerModel } from "../models/issuer.model";
import { AuthUtils } from "../utils/auth.utils";
import { AuthService } from "./auth.service";
import { randomBytes } from "crypto";

export class ApiService {
    static async generateApiKey(token: string) {
        try {
            const user = await AuthService.getUser(token);
            if (!user || !user.issuer) {
                throw new Error("Invalid token");
            }

            console.log("Got user...");

            const apiKey = randomBytes(32).toString("hex");
            const hashedApiKey =  await AuthUtils.hashPassword(apiKey);

            const success = await IssuerModel.setApiKey(user.id, hashedApiKey);

            console.log("Set API key...", success);

            if (!success) {
                throw new Error("Failed to set API key");
            }

            return apiKey;
        } catch (error) {
            console.error("Error in generateApiKey:", error);
            throw new Error("Failed to generate API key");
        }
    }

    static async revokeApiKey(token: string) {
        try {
            const user = await AuthService.getUser(token);
            if (!user || !user.issuer) {
                throw new Error("Invalid token");
            }

            console.log("Got user...");

            const success = await IssuerModel.setApiKey(user.id, null);

            console.log("Revoked API key...", success);

            if (!success) {
                throw new Error("Failed to revoke API key");
            }

            return true;
        } catch (error) {
            console.error("Error in revokeApiKey:", error);
            throw new Error("Failed to revoke API key");
        }
    }
};