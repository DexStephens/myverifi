import { HolderUser } from "@prisma/client";
import prisma from "../utils/db.util";

export class HolderUserModel {
  static async createUser(data: {
    email: string;
    password_hash: string;
  }): Promise<HolderUser> {
    return prisma.holderUser.create({
      data,
    });
  }

  static async findUserById(id: number): Promise<HolderUser | null> {
    return prisma.holderUser.findUnique({
      where: { id },
    });
  }

  static async findUserByEmail(email: string): Promise<HolderUser | null> {
    return prisma.holderUser.findUnique({
      where: { email },
    });
  }

  static async updateUserByEmail(
    email: string,
    data: Partial<HolderUser>
  ): Promise<HolderUser> {
    return prisma.holderUser.update({
      where: { email },
      data,
    });
  }

  static async deleteUser(id: number): Promise<HolderUser> {
    return prisma.holderUser.delete({
      where: { id },
    });
  }
}
