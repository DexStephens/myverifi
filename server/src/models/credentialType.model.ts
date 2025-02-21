import { CredentialType } from "@prisma/client";
import prisma from "../config/db.config";
import { getAddress } from "viem";

export class CredentialTypeModel {
  static async createCredentialType(data: {
    name: string;
    token_id: bigint;
    issuer_id: number;
  }): Promise<CredentialType> {
    return prisma.credentialType.create({
      data,
    });
  }

  static async findIssuerCredentialTypes(
    issuer_id: number
  ): Promise<CredentialType[]> {
    return prisma.credentialType.findMany({
      where: { issuer_id },
    });
  }

  static async findIssueCredentialTypeByContractAddressAndTokenId(
    token_id: bigint,
    contract_address: string
  ) {
    return prisma.credentialType.findFirst({
      where: {
        token_id: Number(token_id.toString()),
        issuer: {
          contract_address: getAddress(contract_address),
        },
      },
    });
  }

  static async findCredentialTypeByTokenIdAndIssuerId(
    token_id: bigint,
    name: string
  ): Promise<CredentialType | null> {
    return prisma.credentialType.findFirst({
      where: {
        token_id: Number(token_id.toString()),
        name: name,
      },
    });
  }
}
