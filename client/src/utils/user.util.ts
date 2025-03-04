import { Address } from "viem";
import { parseApiError } from "./api.util";

export interface User {
  email: string;
  address?: Address;
  issuer?: Issuer;
  holder?: Holder;
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
};

type Holder = {
  credential_issues: CredentialIssue[];
};

type Issuer = {
  name: string;
  contract_address?: Address;
  credential_types: CredentialType[];
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export async function updateUserAddress(
  email: string,
  address: Address,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:3000/issuances/address", {
      method: "PUT",
      body: JSON.stringify({
        email,
        address,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      setUser((currentUser) => {
        return currentUser ? { ...currentUser, address } : null;
      });
      return {
        status: true,
      };
    } else {
      return {
        status: false,
        message: parseApiError(data),
      };
    }
  } catch {
    return { status: false };
  }
}

export async function getUserAddress(email: string) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `http:localhost:3000/issuances/user/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      return {
        status: true,
        address: data.data.address,
      };
    } else {
      return {
        status: false,
        message: parseApiError(data),
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to fetch user address from email: " + error,
    };
  }
}
