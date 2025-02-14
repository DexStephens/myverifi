import { CredentialIssueModel } from "../models/credentialIssue.model";
import { CredentialTypeModel } from "../models/credentialType.model";
import { IssuerModel } from "../models/issuer.model";
import { UserModel } from "../models/user.model";
import {
  ContractCreationArgs,
  CredentialCreationArgs,
  CredentialIssuanceArgs,
} from "../types";

export class ChainService {
  static async onContractCreated(newContracts: ContractCreationArgs[]) {
    for (const contract of newContracts) {
      const { contractAddress, institution } = contract;

      const user = await UserModel.findUserByAddress(institution);

      if (user && user.issuer) {
        //TO CONSIDER: Should we handle if they already have a contract address?
        await IssuerModel.updateIssuerContractAddress(
          user.issuer.id,
          contractAddress
        );

        return;
      }

      console.log("No user found for contract creation", contract);
    }
  }

  static async onCredentialCreation(newCredentials: CredentialCreationArgs[]) {
    for (const credential of newCredentials) {
      console.log("credential", credential);
      const { name, tokenId, institution } = credential;

      const user = await UserModel.findUserByAddress(institution);

      if (
        user &&
        user.issuer &&
        !user.issuer.credential_types.find(
          (credentialType) => credentialType.token_id === tokenId
        )
      ) {
        await CredentialTypeModel.createCredentialType({
          name,
          token_id: tokenId,
          issuer_id: user.issuer.id,
        });

        return;
      }

      console.log("Unable to create credential type", credential);
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

      if (
        user &&
        user.holder &&
        credentialType &&
        !user.holder.credential_issues.find(
          (credentialIssue) =>
            credentialIssue.credential_type_id === credentialType.id
        )
      ) {
        await CredentialIssueModel.createCredentialIssue({
          holder_id: user.holder.id,
          credential_type_id: credentialType.id,
        });

        return;
      }

      console.log("Unable to issue credential", issue);
    }
  }
}
