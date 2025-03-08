import { Wallet } from "@prisma/client";
import prisma from "../config/db.config";

export class WalletModel {
  static async create(data: {
    address: string;
    publicKey: string;
    privateKey: string;
  }): Promise<Wallet> {
    return prisma.wallet.create({
      data: {
        address: data.address.toLowerCase(),
        publicKey: data.publicKey.toLowerCase(),
        privateKey: data.privateKey.toLowerCase(),
      },
    });
  }

  static async findById(id: number) {
    return prisma.credentialType.findUnique({
      where: {
        id,
      },
    });
  }
}
