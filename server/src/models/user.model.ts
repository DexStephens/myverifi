import { User } from "@prisma/client";
import prisma from "../config/db.config";

export class UserModel {
  static async createUser(data: {
    email: string;
    password_hash: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  static async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        holder: true,
        issuer: true,
      },
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        holder: {
          include: {
            credential_issues: true,
          },
        },
        issuer: {
          include: {
            credential_types: true,
          },
        },
      },
    });
  }

  static async findUserByAddress(address: string) {
    return prisma.user.findFirst({
      where: { address },
      include: {
        holder: {
          include: {
            credential_issues: true,
          },
        },
        issuer: {
          include: {
            credential_types: true,
          },
        },
      },
    });
  }
}
