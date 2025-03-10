import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "../utils/user.util";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/useSocket";
import { CONSTANTS } from "../config/constants";
import { Address } from "viem";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Function to fetch user data from API
  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        navigate("/login");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/auth/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...({ Authorization: `Bearer ${token}` }),
          }
        }
      );

      const data = await response.json();
      console.log("Polled user data:", data);

      if (data.status === "success") {
        setUser(data.data);
        return { status: true, user: data.data };
      } else {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      navigate("/login");
    }
  };

  // Fetch user on mount and set up polling
  useEffect(() => {
    fetchUserData(); // Initial fetch

    const interval = setInterval(fetchUserData, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useSocket(user?.wallet.address as Address, {
    [CONSTANTS.SOCKET_EVENTS.CONTRACT_CREATION]: ({ contract_address }) => {
      setUser((currentUser) => {
        if (currentUser && currentUser.issuer) {
          return {
            ...currentUser,
            issuer: { ...currentUser.issuer, contract_address },
          };
        }
        return currentUser;
      });
    },
    [CONSTANTS.SOCKET_EVENTS.CREDENTIAL_CREATION]: ({
      id,
      name,
      token_id,
      issuer_id,
    }) => {
      setUser((currentUser) => {
        if (
          currentUser &&
          currentUser.issuer &&
          !currentUser.issuer.credential_types.find((ct) => ct.id === id)
        ) {
          return {
            ...currentUser,
            issuer: {
              ...currentUser.issuer,
              credential_types: [
                ...currentUser.issuer.credential_types,
                { id, name, token_id, issuer_id },
              ],
            },
          };
        }
        return currentUser;
      });
    },
    [CONSTANTS.SOCKET_EVENTS.CREDENTIAL_ISSUANCE]: ({
      id,
      holder_id,
      credential_type_id,
      credential_type,
    }) => {
      setUser((currentUser) => {
        if (
          currentUser &&
          currentUser.holder &&
          !currentUser.holder.credential_issues.find((ci) => ci.id === id)
        ) {
          return {
            ...currentUser,
            holder: {
              ...currentUser.holder,
              credential_issues: [
                ...currentUser.holder.credential_issues,
                { id, holder_id, credential_type_id, credential_type },
              ],
            },
          };
        }

        return currentUser;
      });
    },
  });

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  console.log("user", user);

  return (
    <UserContext.Provider value={{ user, setUser, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
