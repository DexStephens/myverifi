import { Holder } from "@prisma/client";
import prisma from "../config/db.config";

export class HolderModel {
  static async createHolder(data: { userId: number }): Promise<Holder> {
    return prisma.holder.create({
      data,
    });
  }

  static async findHolderByUserId(userId: number): Promise<Holder | null> {
    return prisma.holder.findUnique({
      where: { userId },
    });
  }

  static findByEmails(emails: string[]) {
    return prisma.holder.findMany({
      where: {
        user: {
          email: {
            in: emails,
          },
        },
      },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
      },
    });
  }
}
