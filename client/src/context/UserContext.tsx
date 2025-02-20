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

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     sessionStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     sessionStorage.removeItem("user");
  //   }
  // }, [user]);

  useSocket(user?.address, {
    [CONSTANTS.SOCKET_EVENTS.CONTRACT_CREATION]: ({ contract_address }) => {
      setUser((currentUser) => {
        if (currentUser && currentUser.issuer) {
          //const updatedUser =
          return {
            ...currentUser,
            issuer: { ...currentUser.issuer, contract_address },
          };
          // sessionStorage.setItem("user", JSON.stringify(updatedUser));
          // return updatedUser;
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
    navigate("/login");
  };

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
