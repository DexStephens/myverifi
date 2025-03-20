import { Issuer } from "@prisma/client";
import prisma from "../config/db.config";

export class IssuerModel {
  static async createIssuer(data: {
    userId: number;
    name: string;
    contract_address: string;
  }) {
    return prisma.issuer.create({
      data: {
        ...data,
        contract_address: data.contract_address.toLowerCase(),
      },
    });
  }

  static async findIssuerByUserId(userId: number): Promise<Issuer | null> {
    return prisma.issuer.findUnique({
      where: { userId },
    });
  }

  static async getAll() {
    return prisma.issuer.findMany();
  }

  static getAllWithCredentialTypes() {
    return prisma.issuer.findMany({
      where: {
        credential_types: {
          some: {},
        },
      },
      include: {
        credential_types: true,
      },
    });
  }

  static async setApiKey(userId: number, apiKey: string) {
    return prisma.issuer.update({
      where: { userId: userId },
      data: { apiKey },
    });
  }
}
