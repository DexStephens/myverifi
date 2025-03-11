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
import { HolderModel } from "../models/holder.model";
import { CredentialIssueModel } from "../models/credentialIssue.model";

export class IssuanceService {
  static async retrieveAddress(email: string) {
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user exists for the email: ${email}`
      );
    }

    return user.wallet.address;
  }

  static async issuers() {
    const issuers = await IssuerModel.getAllWithCredentialTypes();

    return issuers;
  }

  static async createCredentialType(email: string, title: string, cid: string) {
    const user = await UserModel.findUserByEmail(email);

    if (!user || !user.issuer) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user exists for the email: ${email}`
      );
    }

    await ChainUtils.createCredentialType(
      user.wallet.privateKey as Address,
      user.issuer.contract_address as Address,
      title,
      cid
    );
  }

  static async issueCredential(emails: string[], credential_id: number) {
    const credentialType = await CredentialTypeModel.findById(credential_id);

    if (!credentialType) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No credential exists for the id: ${credential_id}`
      );
    }

    const holders = await HolderModel.findByEmails(emails);

    if (holders.length === 1) {
      const holder = holders[0];

      await ChainUtils.issueCredential(
        credentialType.issuer.user.wallet.privateKey as Address,
        credentialType.issuer.contract_address as Address,
        holder.user.wallet.address as Address,
        credentialType.token_id
      );
    } else {
      await ChainUtils.batchIssueCredential(
        credentialType.issuer.user.wallet.privateKey as Address,
        credentialType.issuer.contract_address as Address,
        holders.map((holder) => holder.user.wallet.address as Address),
        credentialType.token_id
      );
    }

    return holders.map((holder) => holder.user.email);
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

    const response = [];

    const publicClient = ChainUtils.getPublicClient();

    for (const credentialType of credentialTypes) {
      const valid = await publicClient.readContract({
        address: credentialType.issuer.contract_address as Address,
        abi: institutionCredentialAbi,
        functionName: CREDENTIAL_CONTRACT_METHODS.VERIFY_CREDENTIAL,
        args: [user.wallet.address, credentialType.token_id],
      });

      response.push({
        credential_type_id: credentialType.id,
        valid,
      });
    }

    return response;
  }

  static async getCredential(id: number) {
    const credential = await CredentialIssueModel.findById(id);
    console.log("Found credential", credential);

    if (!credential) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No credential issue exists for the id: ${id}`
      );
    }

    return credential;
  }

  static async updateCredential(id: number, hidden: boolean) {
    const credential = await this.getCredential(id);

    if (!credential) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No credential issue exists for the id: ${id}`
      );
    }

    return await CredentialIssueModel.updateHidden(id, hidden);
  }
}
