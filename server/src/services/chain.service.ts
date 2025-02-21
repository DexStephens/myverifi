import { CredentialIssueModel } from "../models/credentialIssue.model";
import { CredentialTypeModel } from "../models/credentialType.model";
import { IssuerModel } from "../models/issuer.model";
import { UserModel } from "../models/user.model";
import {
  ContractCreationArgs,
  CredentialCreationArgs,
  CredentialIssuanceArgs,
} from "../types";
import { eventBus } from "../busHandlers";
import { SOCKET_EVENTS } from "../config/constants.config";
//import prisma from "../config/db.config";

export class ChainService {
  static async onContractCreated(newContracts: ContractCreationArgs[]) {
    for (const contract of newContracts) {
      const { contractAddress, institution } = contract;

      const user = await UserModel.findUserByAddress(institution);

      if (user && user.issuer) {
        await IssuerModel.updateIssuerContractAddress(
          user.issuer.id,
          contractAddress
        );

        eventBus.emit(SOCKET_EVENTS.CONTRACT_CREATION, {
          address: user.address,
          contract_address: contractAddress,
        });
        return;
      }

      console.log("No user found for contract creation", contract);
    }
  }

  static async onCredentialCreation(newCredentials: CredentialCreationArgs[]) {
    for (const credential of newCredentials) {
      const { name, tokenId, institution } = credential;

      const user = await UserModel.findUserByAddress(institution);

      // const existingCredential = await prisma.credentialType.findFirst({
      //   where: {
      //     token_id: tokenId,
      //     name: name,
      //   },
      // });

      // if (existingCredential) {
      //   console.error(`Token ID ${tokenId} and name ${name} already exists`);
      //   return;
      // }

      if (
        user &&
        user.issuer &&
        !user.issuer.credential_types.find(
          (credentialType) => credentialType.token_id === tokenId
        )
      ) {
        const credentialType = await CredentialTypeModel.createCredentialType({
          name,
          token_id: tokenId,
          issuer_id: user.issuer.id,
        });
        console.log("Credential Type Created", credentialType);
        eventBus.emit(SOCKET_EVENTS.CREDENTIAL_CREATION, {
          address: user.address,
          id: credentialType.id,
          name: credentialType.name,
          token_id: credentialType.token_id,
          issuer_id: credentialType.issuer_id,
        });
        return;
      } else {
        console.log("Credential Type already exists", credential.name);
      }

      //console.log("Unable to create credential type", credential);
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
        const credentialIssue =
          await CredentialIssueModel.createCredentialIssue({
            holder_id: user.holder.id,
            credential_type_id: credentialType.id,
          });

        eventBus.emit(SOCKET_EVENTS.CREDENTIAL_ISSUANCE, {
          address: recipient,
          id: credentialIssue.id,
          holder_id: credentialIssue.holder_id,
          credential_type_id: credentialIssue.holder_id,
          credential_type: credentialIssue.credential_type,
        });
        return;
      }

      console.log("Unable to issue credential", issue);
    }
  }
}
