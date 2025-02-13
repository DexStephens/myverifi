import { useWriteContract } from "wagmi";
import {
  credentialFactoryAbi,
  institutionCredentialAbi,
} from "../utils/abi.util";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export default function Testing() {
  const { data: hash, isPending, writeContract } = useWriteContract();

  const unwatch = publicClient.watchContractEvent({
    address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
    abi: credentialFactoryAbi,
    eventName: "InstitutionDeployed",
    onLogs: (logs) => console.log("viem", logs),
  });

  //NEEDSWORK: get the new contract address after creation of smart contract
  //NEEDSWORK: why are event logs outputted multiple times, is this just a localhost thing? or potentially reloading thing
  //NEEDSWORK: what are ways to handle this without the event, because we have disassociated data, need to look into our use cases

  async function onCreateInstitutionCredentialContract() {
    console.log("Creating credential contract");
    writeContract({
      address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
      abi: credentialFactoryAbi,
      functionName: "deployInstitutionContract",
      args: ["Brigham Young University", "http://testing/{id}.json"],
    });
  }

  async function onCreateInstitutionCredentialType() {
    writeContract({
      address: "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
      abi: institutionCredentialAbi,
      functionName: "createCredentialType",
      args: ["MISM"],
    });
  }

  async function onIssueInstitutionCredential() {
    writeContract({
      address: "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
      abi: institutionCredentialAbi,
      functionName: "issueCredential",
      args: ["0xdD2FD4581271e230360230F9337D5c0430Bf44C0", 1],
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h1>Testing functionality</h1>
      <button onClick={onCreateInstitutionCredentialContract}>
        create credential contract
      </button>
      <button onClick={onCreateInstitutionCredentialType}>
        create credential type
      </button>
      <button onClick={onIssueInstitutionCredential}>issue credential</button>
      {isPending && <p>Pending...</p>}
      {hash && <div>Transaction hash: {hash}</div>}
    </div>
  );
}
