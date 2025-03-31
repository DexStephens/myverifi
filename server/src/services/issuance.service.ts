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
import { CredentialIssueModel } from "../models/credentialIssue.model";
import { credentialQueue } from "./credentialQueue.service";
import { issuanceQueue } from "./issuanceQueue.service";
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

    credentialQueue.enqueue(email, title, cid);

    return { status: "pending" };
  }

  static async createCredentialTypeApi(
    issuer_id: number,
    title: string,
    attributes: string[]
  ) {
    const issuer = await IssuerModel.findById(issuer_id);
    if (!issuer) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No issuer exists for the id: ${issuer_id}`
      );
    }

    const user = await UserModel.findUserById(issuer.userId);

    await ChainUtils.createCredentialType(
      user.wallet.privateKey as Address,
      issuer.contract_address as Address,
      title,
      ""
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

    issuanceQueue.enqueue(
      credentialType.issuer.user.email,
      credential_id,
      credentialType.name,
      emails
    );

    return { status: "pending" };
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

  static async issueCredentialApi(
    issuer_id: number,
    email: string,
    credential_id: number
  ) {
    return await this.issueCredential([email], credential_id);
  }
}
