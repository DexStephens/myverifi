import { JsonObject } from "@prisma/client/runtime/library";
import { HolderUserModel } from "../models/holderUser.model";
import { PushUtil } from "../utils/push.util";
import { PinataUtil } from "../utils/pinata.util";
export class IssuanceService {
  static async create(
    email: string,
    organization: string,
    file: Express.Multer.File
  ): Promise<void> {
    const user = await HolderUserModel.findUserByEmail(email);
    if (!user) {
      //TODO: need to better handle how this error is handled in the controller and returned to the user
      throw new Error("User not found");
    }

    let cid: string;
    if (file) {
      cid = await PinataUtil.upload(file);

      if (!cid) {
        //TODO: need to better handle how this error is handled in the controller and returned to the user
        throw new Error("Failed to upload file to Pinata");
      }
    }

    //TODO: This data will be updated to include the organization name and the hash of the block that was issued
    PushUtil.sendPushNotification(user.subscription as JsonObject, {
      type: "issuance",
      data: {
        organization,
        requestId: 1,
      },
    });
  }

  static async respond(id: string, did: string): Promise<void> {
    console.log(id, did);
    return null;
  }
}
