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

export interface PendingCredentialType {
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

export type CredentialIssue = {
  id: number;
  holder_id: number;
  credential_type_id: number;
  credential_type: CredentialType & { issuer: Issuer };
  hidden: boolean;
};

export interface PendingIssuanceType {
  credential_name: string;
  holder_emails: string[];
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  pendingCredentials: PendingCredentialType[];
  pendingIssuances: PendingIssuanceType[];
}
