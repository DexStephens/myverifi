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

// Contract Events
export interface ContractCreationArgs {
  institution: `0x${string}`;
  contractAddress: `0x${string}`;
}

export interface CredentialCreationArgs {
  name: string;
  tokenId: bigint;
  institution: `0x${string}`;
}

export interface CredentialIssuanceArgs {
  tokenId: bigint;
  recipient: `0x${string}`;
  contractAddress: `0x${string}`;
}
