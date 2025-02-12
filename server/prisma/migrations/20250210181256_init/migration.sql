/*
  Warnings:

  - You are about to drop the `HolderUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationAddress" DROP CONSTRAINT "OrganizationAddress_org_id_fkey";

-- DropTable
DROP TABLE "HolderUser";

-- DropTable
DROP TABLE "OrganizationAddress";

-- DropTable
DROP TABLE "WebUser";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Holder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issuer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "contract_address" TEXT NOT NULL,
    "json_uri" TEXT NOT NULL,

    CONSTRAINT "Issuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredentialType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "issuer_id" INTEGER NOT NULL,

    CONSTRAINT "CredentialType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredentialIssue" (
    "id" SERIAL NOT NULL,
    "holder_id" INTEGER NOT NULL,
    "credential_type_id" INTEGER NOT NULL,

    CONSTRAINT "CredentialIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Holder_userId_key" ON "Holder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_userId_key" ON "Issuer"("userId");

-- AddForeignKey
ALTER TABLE "Holder" ADD CONSTRAINT "Holder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issuer" ADD CONSTRAINT "Issuer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialType" ADD CONSTRAINT "CredentialType_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "Issuer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialIssue" ADD CONSTRAINT "CredentialIssue_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "Holder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialIssue" ADD CONSTRAINT "CredentialIssue_credential_type_id_fkey" FOREIGN KEY ("credential_type_id") REFERENCES "CredentialType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
