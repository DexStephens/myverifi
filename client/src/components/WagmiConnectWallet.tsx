import { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
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
  const { data: hash, writeContract } = useWriteContract();
  //const { writeContract } = useWriteContract();
  //This might be temporary, what I am using to keep the newly deployed institution contract address
  const { data: receipt, isSuccess } = useWaitForTransactionReceipt({ hash });

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

    if (isSuccess && receipt) {
      console.log("Contract deployed successfully");
      console.log("Transaction Hash:", receipt.transactionHash);
      console.log("Block Number:", receipt.blockNumber);
      console.log("From:", receipt.from);
      console.log("To:", receipt.to);

      // Log each raw log for inspection
      receipt.logs.forEach((log, index) => {
        console.log(`Log ${index}:`, {
          address: log.address,
          topics: log.topics,
          data: log.data,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
        });
      });

      console.log(
        "Log addresses:",
        receipt.logs.map((log) => log.address)
      );
      console.log(
        "Factory address:",
        import.meta.env.VITE_CREDENTIAL_FACTORY_ADDRESS
      );

      const deployEvent = receipt.logs.find((log) => {
        try {
          // First check if this log is from our factory contract
          if (
            log.address.toLowerCase() !==
            import.meta.env.VITE_CREDENTIAL_FACTORY_ADDRESS.toLowerCase()
          ) {
            return false;
          }

          const decoded = decodeEventLog({
            abi: credentialFactoryAbi,
            data: log.data,
            topics: log.topics,
          });
          console.log("Decoded event from factory contract:", decoded);
          return decoded.eventName === "InstitutionDeployed";
        } catch (error) {
          console.error("Error decoding event:", error);
          return false;
        }
      });
      console.log("Deploy event: ", deployEvent);
      if (deployEvent) {
        console.log("Contract deployed at: ", deployEvent.args.contractAddress);
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            issuer: prev.issuer
              ? {
                  ...prev.issuer,
                  contract_address: deployEvent.args.contractAddress,
                }
              : prev.issuer,
          };
        });
      }
    }
  }, [
    isConnected,
    address,
    user,
    error,
    setUser,
    disconnect,
    writeContract,
    receipt,
    isSuccess,
  ]);

  return (
    <div className="container">
      {error && <p>{error}</p>}
      {isConnected ? <Account /> : <Connect />}
    </div>
  );
}
