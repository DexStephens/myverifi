import { JsonObject } from "@prisma/client/runtime/library";
import { UserModel } from "../models/user.model";
import { PushUtil } from "../utils/push.util";

export class IssuanceService {
  static async create(email: string, organization: string): Promise<void> {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    PushUtil.sendPushNotification(user.subscription as JsonObject, {
      type: "issuance",
      data: {
        organization,
        requestId: 1,
      },
    });
  }

  static async respond(id: string, did: string): Promise<void> {
    return null;
  }
}
