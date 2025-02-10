import { useState } from "react";
import { WalletClient } from "viem";
import ConnectWallet from "./WagmiConnectWallet";
import ContractPlay from "./ContractPlay";

export default function HardhatConnection() {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  return (
    <div>
      <h1>Connecting to hardhat network</h1>
      <ConnectWallet setWalletClient={setWalletClient} />
      {walletClient && <ContractPlay walletClient={walletClient} />}
    </div>
  );
}
