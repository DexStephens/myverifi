import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useUser } from "../context/UserContext";
import { updateUserAddress } from "../utils/user.util";
import { Address } from "viem";
import { Account } from "./Account";
import { Connect } from "./Connect";

export function WagmiConnectWallet() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, setUser } = useUser();
  const [error, setError] = useState("");

  useEffect(() => {
    const sendAddress = async (email: string, address: Address) => {
      const response = await updateUserAddress(email, address, setUser);

      if (response.status) {
        setError("");
      } else {
        setError(response.message);
      }
    };

    if (isConnected && user && address) {
      if (!user?.address && !error) {
        sendAddress(user.email, address);
      } else if (address !== user.address) {
        disconnect();
        setError(
          `Your account is associated with the address: ${user.address}, please reconnect your wallet to be associated with the correct address.`
        );
      } else if (error) {
        setError("");
      }
    }
  }, [isConnected, address, user, error, setUser, disconnect]);

  return (
    <div className="container">
      {error && <p>{error}</p>}
      {isConnected ? <Account /> : <Connect />}
    </div>
  );
}
