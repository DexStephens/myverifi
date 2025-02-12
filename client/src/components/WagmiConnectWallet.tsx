import { useAccount, useDisconnect } from "wagmi";
import { Account } from "./Account";
import { Connect } from "./Connect";

export function WagmiConnectWallet() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="container">
      <button onClick={() => disconnect()}>reset</button>
      {isConnected ? <Account /> : <Connect />}
    </div>
  );
}
