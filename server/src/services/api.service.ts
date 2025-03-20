import { IssuerModel } from "../models/issuer.model";
import { AuthService } from "./auth.service";

export class ApiService {
    static async generateApiKey(token: string) {
        try {
            // Get the user from the token
            const user = await AuthService.getUser(token);
            if (!user || !user.issuer) {
                throw new Error("Invalid token");
            }

            const success = await IssuerModel.setApiKey(user.id, 'test-api-key-123456');

            // Simulate API key generation
            return "mock-api-key-123456";
        } catch (error) {
            throw new Error("Failed to generate API key");
        }
    }
};