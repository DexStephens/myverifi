import { IssuerModel } from "../models/issuer.model";
import { AuthUtils } from "../utils/auth.utils";
import { AuthService } from "./auth.service";
import { randomBytes } from "crypto";

export class ApiService {
    static async generateApiKey(token: string) {
        try {
            // Get the user from the token
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

            // Simulate API key generation
            return apiKey;
        } catch (error) {
            console.error("Error in generateApiKey:", error);
            throw new Error("Failed to generate API key");
        }
    }
};