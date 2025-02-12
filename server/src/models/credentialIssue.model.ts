import { CredentialIssue } from "@prisma/client";
import prisma from "../config/db.config";

export class CredentialIssueModel {
  static async createCredentialIssue(data: {
    holder_id: number;
    credential_type_id: number;
  }): Promise<CredentialIssue> {
    return prisma.credentialIssue.create({
      data,
    });
  }

  static async findHolderCredentialIssues(
    holder_id: number
  ): Promise<CredentialIssue[]> {
    return prisma.credentialIssue.findMany({
      where: { holder_id },
      include: {
        credential_type: {
          include: {
            issuer: true,
          },
        },
      },
    });
  }
}
