import { Issuer } from "@prisma/client";
import prisma from "../config/db.config";

export class IssuerModel {
  static async createIssuer(data: {
    userId: number;
    name: string;
    contract_address?: string;
  }) {
    return prisma.issuer.create({
      data,
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
      data: { contract_address },
    });
  }
}
