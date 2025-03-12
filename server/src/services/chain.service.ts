import { CredentialIssueModel } from "../models/credentialIssue.model";
import { CredentialTypeModel } from "../models/credentialType.model";
import { UserModel } from "../models/user.model";
import { CredentialCreationArgs, CredentialIssuanceArgs } from "../types";
import { eventBus } from "../busHandlers";
import { SOCKET_EVENTS } from "../config/constants.config";

export class ChainService {
  static async onCredentialCreation(newCredentials: CredentialCreationArgs[]) {
    for (const credential of newCredentials) {
      const { name, tokenId, institution } = credential;

      const user = await UserModel.findUserByAddress(institution);

      let credentialType = user.issuer.credential_types.find(
        (credentialType) => credentialType.token_id === tokenId
      );

      if (user && user.issuer && credentialType === undefined) {
        credentialType = await CredentialTypeModel.createCredentialType({
          name,
          token_id: tokenId,
          issuer_id: user.issuer.id,
        });
      }

      eventBus.emit(SOCKET_EVENTS.CREDENTIAL_CREATION, {
        address: user.wallet.address,
        id: credentialType.id,
        name: credentialType.name,
        token_id: credentialType.token_id,
        issuer_id: credentialType.issuer_id,
      });
    }
  }

  static async onCredentialIssue(newIssues: CredentialIssuanceArgs[]) {
    for (const issue of newIssues) {
      const { tokenId, recipient, contractAddress } = issue;

      const user = await UserModel.findUserByAddress(recipient);

      const credentialType =
        await CredentialTypeModel.findIssueCredentialTypeByContractAddressAndTokenId(
          tokenId,
          contractAddress
        );

      let credentialIssue = user.holder.credential_issues.find(
        (credentialIssue) =>
          credentialIssue.credential_type_id === credentialType.id
      );

      if (
        user &&
        user.holder &&
        credentialType &&
        credentialIssue === undefined
      ) {
        credentialIssue = await CredentialIssueModel.createCredentialIssue({
          holder_id: user.holder.id,
          credential_type_id: credentialType.id,
        });
      }

      eventBus.emit(SOCKET_EVENTS.CREDENTIAL_ISSUANCE, {
        address: recipient,
        id: credentialIssue.id,
        holder_id: credentialIssue.holder_id,
        credential_type_id: credentialIssue.holder_id,
        credential_type: credentialIssue.credential_type,
      });
    }
  }
}
