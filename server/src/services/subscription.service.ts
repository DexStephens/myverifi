import { JsonObject } from "@prisma/client/runtime/library";
import { UserModel } from "../models/user.model";

export class SubscriptionService {
  static async subscribe(subscription: JsonObject, email: string) {
    await UserModel.updateUserByEmail(email, { subscription });
  }
}
