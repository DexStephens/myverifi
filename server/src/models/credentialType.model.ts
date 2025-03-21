import { CredentialType } from "@prisma/client";
import prisma from "../config/db.config";

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

  static async findByIds(ids: number[]) {
    return prisma.credentialType.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        issuer: true,
      },
    });
  }

  static async findById(id: number) {
    return prisma.credentialType.findFirst({
      where: {
        id,
      },
      include: {
        issuer: {
          include: {
            user: {
              include: {
                wallet: true,
              },
            },
          },
        },
      },
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
          contract_address: contract_address.toLowerCase(),
        },
      },
    });
  }
}
