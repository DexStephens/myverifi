import { Address } from "viem";

export interface User {
  email: string;
  wallet: Wallet;
  issuer?: Issuer;
  holder?: Holder;
}

interface Wallet {
  id: number;
  publicKey: string;
  privateKey: string;
  address: string;
}

type CredentialType = {
  id: number;
  name: string;
  token_id: string; // Needs to be converted to bigint
  issuer_id: number;
};

export type CredentialIssue = {
  id: number;
  holder_id: number;
  credential_type_id: number;
  credential_type: CredentialType & { issuer: Issuer };
  hidden: boolean;
};

type Holder = {
  credential_issues: CredentialIssue[];
};

export type Issuer = {
  id: number;
  name: string;
  contract_address: Address;
  credential_types: CredentialType[];
  apiKey?: string;
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
