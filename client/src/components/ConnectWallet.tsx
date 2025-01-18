import { createWalletClient, http, WalletClient } from "viem";
import { publicClient } from "../utils/client";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export default function ConnectWallet({
  setWalletClient,
}: {
  setWalletClient: React.Dispatch<React.SetStateAction<WalletClient | null>>;
}) {
  const publicClientActions = async () => {
    console.log("Public client", publicClient);

    const balance = await publicClient.getBalance({
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    });

    console.log(balance);

    const transactionCount = await publicClient.getTransactionCount({
      address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    });

    console.log(transactionCount);
    // setAccount(address);
    // setWalletClient(walletClient);
  };

  const connectWallet = async () => {
    const account = privateKeyToAccount(
      "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0"
    );

    const client = createWalletClient({
      account,
      chain: hardhat,
      transport: http(),
    });

    console.log("Connected wallet client", client);

    setWalletClient(client);
  };

  return (
    <div>
      <button onClick={publicClientActions}>Public Client Actions</button>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
