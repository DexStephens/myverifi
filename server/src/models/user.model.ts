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
            credential_issues: {
              include: {
                credential_type: {
                  include: {
                    issuer: true,
                  },
                },
              },
            },
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
      where: { address: address.toLowerCase() },
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

  static async updateUserAddress(id: number, address: string) {
    return prisma.user.update({
      where: { id },
      data: { address: address.toLowerCase() },
    });
  }
}
