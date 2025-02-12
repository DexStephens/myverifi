import { CredentialIssue, CredentialType } from "@prisma/client";
export interface AuthResponse {
  email: string;
  issuer?: {
    name: string;
    contract_address: string;
    credential_types: CredentialType[];
  };
  holder?: {
    credential_issues: CredentialIssue[];
  };
}

export interface NewIssuer {
  name: string;
  contract_address: string;
  json_uri: string;
}
