import { PrivateKeyAccount, getContract } from "viem";
import { degreeRegistryAbi } from "../utils/degreeRegistryAbi";
import { publicClient } from "../utils/client";
import { useState } from "react";

export default function ContractPlay({
  account,
}: {
  account: PrivateKeyAccount;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contract, setContract] = useState<any>(null);
  const [events, setEvents] = useState<[]>([]);

  const pullContract = async () => {
    const contract = getContract({
      address:
        import.meta.env.CONTRACT_ADDRESS ??
        "0x5fbdb2315678afecb367f032d93f642f64180aa4",
      abi: degreeRegistryAbi,
      client: publicClient,
    });

    setContract(contract);
  };

  // TODO: need a test account to create a university with, and accounts to add degrees to, need to handle events for when events are emitted and display them as they occur
  const addUniversity = async () => {};

  const assignDegree = async () => {};

  const listenToAddUniversity = async () => {};

  const listenToAssignDegree = async () => {};

  return (
    <div>
      <h1>Account Details</h1>
      <p>{JSON.stringify(account)}</p>
      {contract === null ? (
        <button onClick={pullContract}>Pull Contract Information</button>
      ) : (
        <div>
          <h4>Perform contract actions</h4>
          <ul>
            <li>
              <form action="">
                <p>Add University</p>
              </form>
            </li>
            <li>
              <form action="">
                <p>Add Degree</p>
              </form>
            </li>
          </ul>
          <p>List of occurred events</p>
          <ol>
            {events.map((event) => (
              <li></li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
