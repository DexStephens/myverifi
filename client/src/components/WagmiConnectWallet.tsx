import { useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUser } from "../context/UserContext";
import { updateUserAddress } from "../utils/user.util";
import { Address } from "viem";
import { Account } from "./Account";
import { Connect } from "./Connect";

export function WagmiConnectWallet() {
  const { isConnected, address } = useAccount();
  const { user } = useUser();
  const updatedRef = useRef(false);

  useEffect(() => {
    const sendAddress = async (email: string, address: Address) => {
      const response = await updateUserAddress(email, address);
      if (response) {
        updatedRef.current = true;
      }
    };

    if (!updatedRef.current && isConnected && address && user) {
      sendAddress(user.email, address);
    }
  }, [isConnected, address, user]);

  return (
    <div className="container">{isConnected ? <Account /> : <Connect />}</div>
  );
}
