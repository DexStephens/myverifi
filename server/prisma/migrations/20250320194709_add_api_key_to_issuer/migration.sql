/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `Issuer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Issuer" ADD COLUMN     "apiKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_apiKey_key" ON "Issuer"("apiKey");
