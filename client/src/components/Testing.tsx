import { useWriteContract } from "wagmi";
import {
  credentialFactoryAbi,
  institutionCredentialAbi,
} from "../utils/abi.util";
import { Address } from "viem";
import { CONSTANTS } from "../config/constants";
import { uploadJsonToPinata } from "../utils/pinata.util";

//FUTURE CHALLENGES:
//  Contract Creation: we need to setup a rehydration with tan stack possibly to get the contract address as quickly as possible from the server? Could use websockets but pretty heavy setup?
//  Credential Creation: same thing as above, we need it to show up in their list of credentials asap, do we need to wait for the data to come back from the server first?
//  Credential Issuance: same thing as above, showing the data we want to show?

export default function Testing() {
  const { data: hash, isPending, writeContract } = useWriteContract();

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

  async function onCreateInstitutionCredentialType(
    contractAddress: Address,
    title: string,
    jsonData: object
  ) {
    //First need to upload jsonData to pinata to get a cid to upload to the contract
    const cid = await uploadJsonToPinata(title, jsonData);

    //If successful, then we can create the credential type on our contract
    if (cid !== null) {
      writeContract({
        address: contractAddress,
        abi: institutionCredentialAbi,
        functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_TYPE_CREATION,
        args: [title, cid],
      });
    }
  }

  async function onIssueInstitutionCredential(
    contractAddress: Address,
    recipient: Address,
    tokenId: bigint
  ) {
    writeContract({
      address: contractAddress,
      abi: institutionCredentialAbi,
      functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_ISSUE,
      args: [recipient, tokenId],
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h1>Testing functionality</h1>
      <button
        onClick={() =>
          onCreateInstitutionCredentialContract(
            "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
            "Brigham Young University",
            "http://testing/{id}.json"
          )
        }
      >
        create credential contract
      </button>
      <button
        onClick={() =>
          onCreateInstitutionCredentialType(
            "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
            "MISM",
            { test: Date.now() }
          )
        }
      >
        create credential type
      </button>
      <button
        onClick={() =>
          onIssueInstitutionCredential(
            "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
            "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
            BigInt(1)
          )
        }
      >
        issue credential
      </button>
      {isPending && <p>Pending...</p>}
      {hash && <div>Transaction hash: {hash}</div>}
    </div>
  );
}
