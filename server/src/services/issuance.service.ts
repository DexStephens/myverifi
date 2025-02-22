import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ControllerError } from "../utils/error.util";
import { ERROR_TITLES } from "../config/constants.config";
import { IssuerModel } from "../models/issuer.model";
export class IssuanceService {
  static async address(email: string, address: Address) {
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user exists for the email: ${email}`
      );
    } else if (user.address) {
      throw new ControllerError(
        ERROR_TITLES.DATA,
        `Use initial address of: ${user.address}`
      );
    }

    await UserModel.updateUserAddress(user.id, address);
  }

  static async issuers() {
    const issuers = await IssuerModel.getAllWithCredentialTypes();

    return issuers;
  }
}
