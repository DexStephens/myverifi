/*
  Warnings:

  - A unique constraint covering the columns `[contract_address]` on the table `Issuer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Issuer_contract_address_key" ON "Issuer"("contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
