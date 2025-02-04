/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "HolderUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "subscription" JSONB,

    CONSTRAINT "HolderUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "WebUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationAddress" (
    "id" SERIAL NOT NULL,
    "public_key" TEXT NOT NULL,
    "org_id" INTEGER NOT NULL,

    CONSTRAINT "OrganizationAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HolderUser_email_key" ON "HolderUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WebUser_email_key" ON "WebUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationAddress_public_key_key" ON "OrganizationAddress"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationAddress_org_id_key" ON "OrganizationAddress"("org_id");

-- AddForeignKey
ALTER TABLE "OrganizationAddress" ADD CONSTRAINT "OrganizationAddress_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "WebUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
