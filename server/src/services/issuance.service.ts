import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { PinataUtil } from "../utils/pinata.util";
export class IssuanceService {
  static async create(
    email: string,
    organization: string,
    file: Express.Multer.File
  ): Promise<void> {
    const user = await UserModel.findUserByEmail(email);
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
  }

  static async respond(id: string, did: string): Promise<void> {
    console.log(id, did);
    return null;
  }

  static async address(email: string, address: Address) {
    const user = await UserModel.findUserByEmail(email);

    if (!user || user.address) {
      return false;
    }

    await UserModel.updateUser(user.id, { address });

    return true;
  }
}
