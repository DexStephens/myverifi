import { Issuer } from "@prisma/client";
import prisma from "../config/db.config";

export class IssuerModel {
  static async createIssuer(data: {
    userId: number;
    name: string;
    contract_address: string;
    json_uri: string;
  }): Promise<Issuer> {
    return prisma.issuer.create({
      data,
    });
  }

  static async findIssuerByUserId(userId: number): Promise<Issuer | null> {
    return prisma.issuer.findUnique({
      where: { userId },
    });
  }
}
