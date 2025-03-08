/*
  Warnings:

  - You are about to drop the column `userId` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Wallet_userId_key";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "userId";
