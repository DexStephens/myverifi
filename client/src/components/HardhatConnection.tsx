import { useState } from "react";
import { PrivateKeyAccount } from "viem";
import ConnectWallet from "./ConnectWallet";
import ContractPlay from "./ContractPlay";

export default function HardhatConnection() {
  const [account, setAccount] = useState<PrivateKeyAccount | null>(null);

  return (
    <div>
      <h1>Connecting to hardhat network</h1>
      <ConnectWallet setAccount={setAccount} />
      {account && <ContractPlay account={account} />}
    </div>
  );
}
