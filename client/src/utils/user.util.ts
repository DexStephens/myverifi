import { Address } from "viem";

export interface User {
  email: string;
  issuer?: {
    name: string;
    contract_address: string;
    credential_types: any[];
  };
  holder?: {
    credential_issues: any[];
  };
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export async function updateUserAddress(email: string, address: Address) {
  try {
    const response = await fetch("http://localhost:3000/issuances/address", {
      method: "PUT",
      body: JSON.stringify({
        email,
        address,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch {
    return { status: false };
  }
}
