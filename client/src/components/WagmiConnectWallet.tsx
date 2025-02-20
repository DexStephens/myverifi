import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { useUser } from "../context/UserContext";
import { updateUserAddress } from "../utils/user.util";
import { Address, decodeEventLog } from "viem";
import { Account } from "./Account";
import { Connect } from "./Connect";
import { credentialFactoryAbi } from "../utils/abi.util";
import { CONSTANTS } from "../config/constants.ts";

export function WagmiConnectWallet() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, setUser } = useUser();
  const [error, setError] = useState("");
  const { writeContract } = useWriteContract();

  useEffect(() => {
    const sendAddress = async (email: string, address: Address) => {
      const response = await updateUserAddress(email, address, setUser);

      if (response.status) {
        setError("");
      } else {
        setError(response.message);
      }
    };

    async function onCreateInstitutionCredentialContract(
      contractAddress: Address,
      institutionName: string,
      json_uri: string
    ) {
      writeContract({
        address: contractAddress,
        abi: credentialFactoryAbi,
        functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_FACTORY_DEPLOY,
        args: [institutionName, json_uri],
      });
    }

    if (isConnected && user && address) {
      if (!user?.address && !error) {
        //Update the user address in the database
        console.log("Updating user address in the database");
        sendAddress(user.email, address);
        console.log("User address updated in the database");
        //If the user is an issuer, deploy their smart contract, they will have to sign
        if (user.issuer) {
          console.log(
            "User is an issuer, Deploying institution credential contract"
          );
          try {
            console.log(
              "Creating institution credential contract: ",
              import.meta.env.VITE_CREDENTIAL_FACTORY_ADDRESS,
              user.issuer.name
            );
            onCreateInstitutionCredentialContract(
              import.meta.env.VITE_CREDENTIAL_FACTORY_ADDRESS as Address,
              user.issuer.name,
              "http://testing/uri.json"
            );
            console.log(
              "Should have deployed the contract, check the hardhat terminal"
            );
            console.log("User: ", user);
          } catch (error) {
            console.error(
              "Error creating institution credential contract:",
              error
            );
          }
        }
      } else if (address !== user.address) {
        disconnect();
        setError(
          `Your account is associated with the address: ${user.address}, please reconnect your wallet to be associated with the correct address.`
        );
      } else if (error) {
        setError("");
      }
    }
  }, [isConnected, address, user, error, setUser, disconnect, writeContract]);

  return (
    <div className="container">
      {error && <p>{error}</p>}
      {isConnected ? <Account /> : <Connect />}
    </div>
  );
}
