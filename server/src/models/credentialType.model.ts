import { CredentialType } from "@prisma/client";
import prisma from "../config/db.config";

export class CredentialTypeModel {
  static async createCredentialType(data: {
    name: string;
    token_id: string;
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
}
