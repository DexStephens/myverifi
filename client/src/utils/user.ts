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
