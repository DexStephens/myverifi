import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ControllerError } from "../utils/error.util";
import { ERROR_TITLES } from "../config/constants.config";
import { CredentialTypeModel } from "../models/credentialType.model";
import { publicClient } from "../chainEvents";
import { institutionCredentialAbi } from "../utils/abi.util";
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

    await UserModel.updateUser(user.id, { address });
  }

  static async verify(email: string, credentialTypeIds: number[]) {
    const user = await UserModel.findUserByEmail(email);

    if (!user || !user.address) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user exists for the email: ${email}`
      );
    }

    const credentialTypes = await CredentialTypeModel.findByIds(
      credentialTypeIds
    );

    if (credentialTypeIds.length !== credentialTypeIds.length) {
      throw new ControllerError(ERROR_TITLES.DNE, "Not all id's are valid");
    }

    for (const credentialType of credentialTypes) {
      const valid = await publicClient.readContract({
        address: credentialType.issuer.contract_address as Address,
        abi: institutionCredentialAbi,
        functionName: "verifyCredential",
        args: [user.address, credentialType.token_id],
      });

      if (!valid) {
        return false;
      }
    }

    return true;
  }
}
