import { Issuer } from "@prisma/client";
import prisma from "../config/db.config";

export class IssuerModel {
  static async createIssuer(data: {
    userId: number;
    name: string;
    contract_address?: string;
  }) {
    return prisma.issuer.create({
      data: {
        ...data,
        contract_address: data.contract_address
          ? data.contract_address.toLowerCase()
          : null,
      },
    });
  }

  static async findIssuerByUserId(userId: number): Promise<Issuer | null> {
    return prisma.issuer.findUnique({
      where: { userId },
    });
  }

  static async updateIssuerContractAddress(
    id: number,
    contract_address: string
  ) {
    return prisma.issuer.update({
      where: { id },
      data: { contract_address: contract_address.toLowerCase() },
    });
  }

  static async getAllWithContracts() {
    return prisma.issuer.findMany({
      where: {
        contract_address: {
          not: null,
        },
      },
    });
  }

  static getAllWithCredentialTypes() {
    return prisma.issuer.findMany({
      where: {
        contract_address: {
          not: null,
        },
        credential_types: {
          some: {},
        },
      },
      include: {
        credential_types: true,
      },
    });
  }
}
