import { CredentialIssue, CredentialType, Wallet } from "@prisma/client";
import { Address } from "viem";

export interface AuthResponse {
  id: number;
  email: string;
  wallet: Wallet;
  issuer?: {
    name: string;
    contract_address: string;
    credential_types: CredentialType[];
    apiKey?: string;
  };
  holder?: {
    credential_issues: CredentialIssue[];
  };
  token?: string;
}

export interface NewIssuer {
  name: string;
  contract_address: string;
  json_uri: string;
}

// Contract Events
export interface ContractCreationArgs {
  institution: Address;
  contractAddress: Address;
}

export interface CredentialCreationArgs {
  name: string;
  tokenId: bigint;
  institution: Address;
}

export interface CredentialIssuanceArgs {
  tokenId: bigint;
  recipient: Address;
  contractAddress: Address;
}
