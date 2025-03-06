import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ControllerError } from "../utils/error.util";
import {
  CREDENTIAL_CONTRACT_METHODS,
  ERROR_TITLES,
} from "../config/constants.config";
import { CredentialTypeModel } from "../models/credentialType.model";
import { institutionCredentialAbi } from "../utils/abi.util";
import { IssuerModel } from "../models/issuer.model";
import { ChainUtils } from "../utils/chain.util";

export class IssuanceService {
  static async issuers() {
    const issuers = await IssuerModel.getAllWithCredentialTypes();

    return issuers;
  }

  static async verify(email: string, credentialTypeIds: number[]) {
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
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

    const publicClient = ChainUtils.getPublicClient();

    for (const credentialType of credentialTypes) {
      const valid = await publicClient.readContract({
        address: credentialType.issuer.contract_address as Address,
        abi: institutionCredentialAbi,
        functionName: CREDENTIAL_CONTRACT_METHODS.VERIFY_CREDENTIAL,
        args: [user.wallet.address, credentialType.token_id],
      });

      if (!valid) {
        return false;
      }
    }

    return true;
  }
}
