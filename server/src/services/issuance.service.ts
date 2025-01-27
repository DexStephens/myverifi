import { EmailUtil } from "../utils/email.util";

export class IssuanceService {
  static async create(email: string): Promise<void> {
    EmailUtil.sendEmail(email, "Welcome to the platform", "Hello");
    return null;
  }

  static async respond(id: string, did: string): Promise<void> {
    return null;
  }
}
