import { PrivateKeyAccount, getContract } from "viem";
import { lockAbi } from "../utils/lockAbi";
import { publicClient } from "../utils/client";
import { useState } from "react";

export default function ContractPlay({
  account,
}: {
  account: PrivateKeyAccount;
}) {
  const [contract, setContract] = useState(null);

  const pullContract = async () => {
    const contract = getContract({
      address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      abi: lockAbi,
      client: publicClient,
    });

    console.log(contract);
  };

  return (
    <div>
      <h1>Account Details</h1>
      <p>{JSON.stringify(account)}</p>
      <button onClick={pullContract}>Pull Contract Information</button>
    </div>
  );
}
