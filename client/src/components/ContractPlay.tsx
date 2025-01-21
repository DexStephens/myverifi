import {
  getContract,
  WalletClient,
  GetContractReturnType,
  PublicClient,
  Block,
} from "viem";
import { degreeRegistryAbi } from "../utils/degreeRegistryAbi";
import { publicClient } from "../utils/client";
import { useEffect, useState } from "react";

export type DegreeRegistryContract = GetContractReturnType<
  typeof degreeRegistryAbi,
  WalletClient | PublicClient
>;

export default function ContractPlay({
  walletClient,
}: {
  walletClient: WalletClient;
}) {
  const [contract, setContract] = useState<DegreeRegistryContract | null>(null);

  useEffect(() => {
    // This IS working
    const unwatch = publicClient.watchBlocks({
      onBlock: (block) => blockHandler(block),
      onError: (error) => console.log("error", error),
    });

    return () => unwatch();
  }, []);

  useEffect(() => {
    if (!contract) return;

    const unwatch = publicClient.watchContractEvent({
      address: contract?.address,
      abi: degreeRegistryAbi,
      onLogs: (logs) => console.log("Event logs", logs),
      onError: (error) => {
        console.error("Error watching event:", error);
      },
    });

    return () => unwatch();
  }, [contract]);

  const blockHandler = async (block: Block) => {
    for (const [i, transactionHash] of block.transactions.entries()) {
      try {
        if (
          typeof transactionHash === "string" &&
          transactionHash.startsWith("0x")
        ) {
          const data = await publicClient.getTransaction({
            hash: transactionHash,
          });

          console.log(`Block ${block.hash}, Transaction ${i + 1}`, data);
        }
      } catch (error) {
        console.error(
          `Error fetching transaction ${i + 1} in block ${block.hash}`,
          error
        );
      }
    }
  };

  const pullContract = async () => {
    console.log("Contract info", import.meta.env.VITE_CONTRACT_ADDRESS);
    const contract = getContract({
      address:
        import.meta.env.VITE_CONTRACT_ADDRESS ??
        "0x5fbdb2315678afecb367f032d93f642f64180aa4",
      abi: degreeRegistryAbi,
      client: publicClient,
    });

    setContract(contract);
  };

  // TODO: need a test account to create a university with, and accounts to add degrees to, need to handle events for when events are emitted and display them as they occur
  const addUniversity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contract && walletClient.account) {
      // Highly recommended to simulate to make sure the write will not have any errors: https://viem.sh/docs/contract/writeContract#usage
      const { request } = await publicClient.simulateContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          walletClient.account.address,
        ],
        account: walletClient.account,
      });

      console.log("Simulation result", request);

      const result = await walletClient.writeContract(request);

      console.log("Write to contract result", result);

      const transaction = await publicClient.waitForTransactionReceipt({
        hash: result,
      });

      console.log("Transaction data", transaction);

      const logs = await publicClient.getLogs();

      console.log("Logs", logs);
    }
  };

  const assignDegree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (contract) {
      const unwatch = publicClient.watchContractEvent({
        address: contract?.address,
        abi: contract?.abi,
        onLogs: (logs) => console.log("logs", logs),
      });

      return () => unwatch();
    }
  }, [contract]);

  return (
    <div>
      <h1>Account Details</h1>
      {contract === null ? (
        <button onClick={pullContract}>Pull Contract Information</button>
      ) : (
        <div>
          <h4>Perform contract actions</h4>
          <ul>
            <li>
              <form onSubmit={addUniversity}>
                <p>Add University</p>
                <button type="submit">Submit</button>
              </form>
            </li>
            <li>
              <form onSubmit={assignDegree}>
                <p>Add Degree</p>
                <button type="submit">Submit</button>
              </form>
            </li>
          </ul>
          <p>List of occurred events</p>
          <ol></ol>
        </div>
      )}
    </div>
  );
}
