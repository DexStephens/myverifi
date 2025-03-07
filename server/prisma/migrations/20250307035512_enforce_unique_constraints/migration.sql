/*
  Warnings:

  - A unique constraint covering the columns `[holder_id,credential_type_id]` on the table `CredentialIssue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[issuer_id,token_id]` on the table `CredentialType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CredentialIssue_holder_id_credential_type_id_key" ON "CredentialIssue"("holder_id", "credential_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "CredentialType_issuer_id_token_id_key" ON "CredentialType"("issuer_id", "token_id");
