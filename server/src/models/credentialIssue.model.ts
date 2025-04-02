import { CredentialIssue } from "@prisma/client";
import prisma from "../config/db.config";

export class CredentialIssueModel {
  static async createCredentialIssue(data: {
    holder_id: number;
    credential_type_id: number;
  }) {
    return prisma.credentialIssue.create({
      data,
      include: {
        credential_type: {
          include: {
            issuer: true,
          },
        },
      },
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

  static async findById(id: number): Promise<CredentialIssue | null> {
    console.log("Trying to find credential id", id);
    return prisma.credentialIssue.findUnique({
      where: { id },
      include: {
        credential_type: {
          include: {
            issuer: true,
          },
        },
      },
    });
  }

  static async updateHidden(id: number, hidden: boolean) {
    return prisma.credentialIssue.update({
      where: { id },
      data: { hidden },
    });
  }

  static async findNonHiddenCredentialsById(
    holder_id: number
  ): Promise<CredentialIssue[]> {
    return prisma.credentialIssue.findMany({
      where: {
        holder_id,
        hidden: false,
      },
      include: {
        credential_type: {
          include: {
            issuer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }  
}
