import { User } from "@prisma/client";
import prisma from "../utils/db.util";

export class UserModel {
  static async createUser(data: { email: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  static async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateUserByEmail(
    email: string,
    data: Partial<User>
  ): Promise<User> {
    return prisma.user.update({
      where: { email },
      data,
    });
  }

  static async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
