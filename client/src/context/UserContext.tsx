import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  PendingCredentialType,
  User,
  UserContextType,
} from "../utils/user.util";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/useSocket";
import { CONSTANTS } from "../config/constants";
import { Address } from "viem";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [pendingCredentials, setPendingCredentials] = useState<
    PendingCredentialType[]
  >([]);

  const navigate = useNavigate();

  const fetchUserData = async (): Promise<void> => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }


      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Polled user data:", data);

      if (data.status === "success") {
        sessionStorage.setItem("user", JSON.stringify(data.data));
        setUser(data.data);

        if (data.data.issuer?.pending_credential_types) {
          setPendingCredentials(data.data.issuer.pending_credential_types);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(fetchUserData, 10000);
    return () => clearInterval(interval);
  }, []);

  const eventHandlers = {
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
          setPendingCredentials((prev) =>
            prev.filter((cred) => cred.title !== name)
          );

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
                {
                  id,
                  holder_id,
                  credential_type_id,
                  credential_type,
                  hidden: false,
                },
              ],
            },
          };
        }

        return currentUser;
      });
    },
    [CONSTANTS.SOCKET_EVENTS.CREDENTIAL_QUEUE_UPDATE]: (data) => {
      console.log("Received credential queue update:", data);

      if (user?.issuer?.credential_types) {
        const filteredData = data.filter((pending: PendingCredentialType) => {
          const exists = user.issuer.credential_types.some(
            (existing) => existing.name === pending.title
          );
          return !exists;
        });

        setPendingCredentials(filteredData);
      } else {
        setPendingCredentials(data);
      }
    },
  };

  useSocket(user?.wallet?.address as Address, eventHandlers);

  const handleLogout = () => {
    setUser(null);
    setPendingCredentials([]);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout: handleLogout,
        fetchUserData,
        pendingCredentials,
      }}

    >
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
