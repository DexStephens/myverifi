import { WebUser } from "@prisma/client";
import prisma from "../config/db.config";

export class WebUserModel {
  static async createUser(data: {
    email: string;
    password_hash: string;
    title: string;
    street_address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  }): Promise<WebUser> {
    return prisma.webUser.create({
      data,
    });
  }

  static async findUserById(id: number): Promise<WebUser | null> {
    return prisma.webUser.findUnique({
      where: { id },
    });
  }

  static async findUser(
    email: string,
    title?: string
  ): Promise<WebUser | null> {
    return prisma.webUser.findUnique({
      where: { email, ...(title && { title }) },
    });
  }
}
