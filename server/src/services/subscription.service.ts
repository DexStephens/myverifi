import { JsonObject } from "@prisma/client/runtime/library";
import { HolderUserModel } from "../models/holderUser.model";

export class SubscriptionService {
  static async subscribe(subscription: JsonObject, email: string) {
    await HolderUserModel.updateUserByEmail(email, { subscription });
  }
}
