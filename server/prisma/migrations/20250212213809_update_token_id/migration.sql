/*
  Warnings:

  - You are about to drop the column `json_uri` on the `Issuer` table. All the data in the column will be lost.
  - Changed the type of `token_id` on the `CredentialType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CredentialType" DROP COLUMN "token_id",
ADD COLUMN     "token_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Issuer" DROP COLUMN "json_uri";
