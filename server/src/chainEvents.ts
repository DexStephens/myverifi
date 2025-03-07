import { Address } from "viem";
import {
  credentialFactoryAbi,
  institutionCredentialAbi,
} from "./utils/abi.util";
import { ChainService } from "./services/chain.service";
import {
  ContractCreationArgs,
  CredentialCreationArgs,
  CredentialIssuanceArgs,
} from "./types";
import { CREDENTIAL_CONTRACT_EVENTS } from "./config/constants.config";
import { IssuerModel } from "./models/issuer.model";
import { ChainUtils } from "./utils/chain.util";

const contractListeners = new Set<Address>();

export async function startBlockchainListener(factoryAddress: Address) {
  const publicClient = ChainUtils.getPublicClient();

  publicClient.watchContractEvent({
    address: factoryAddress,
    abi: credentialFactoryAbi,
    eventName: CREDENTIAL_CONTRACT_EVENTS.INSTITUTION_DEPLOYED,
    onLogs: (logs) => {
      const contractsCreated = parseLogs<ContractCreationArgs>(logs as never);
      contractsCreated.forEach((contract) => {
        addNewCredentialContractListeners(
          contract.contractAddress.toLowerCase() as Address
        );
      });
    },
  });

  const issuers = await IssuerModel.getAll();
  issuers.forEach((issuer) => {
    const { contract_address } = issuer;

    addNewCredentialContractListeners(contract_address as Address);
  });
}

export function addNewCredentialContractListeners(contractAddress: Address) {
  if (contractListeners.has(contractAddress)) {
    return;
  }

  contractListeners.add(contractAddress);

  const publicClient = ChainUtils.getPublicClient();

  publicClient.watchContractEvent({
    address: contractAddress,
    abi: institutionCredentialAbi,
    eventName: CREDENTIAL_CONTRACT_EVENTS.CREDENTIAL_CREATION,
    onLogs: (logs) =>
      ChainService.onCredentialCreation(
        parseLogs<CredentialCreationArgs>(logs as never)
      ),
  });

  publicClient.watchContractEvent({
    address: contractAddress,
    abi: institutionCredentialAbi,
    eventName: CREDENTIAL_CONTRACT_EVENTS.CREDENTIAL_ISSUANCE,
    onLogs: (logs) =>
      ChainService.onCredentialIssue(
        parseLogs<CredentialIssuanceArgs>(logs as never, (log) => {
          const { address } = log;
          return { contractAddress: address };
        })
      ),
  });
}

function parseLogs<T>(
  logs: never[],
  additional?: (log: never) => Record<string, string>
): T[] {
  return logs.map((log) => {
    const { args } = log;

    return {
      ...(args as Record<string, string>),
      ...(additional ? additional(log) : {}),
    } as T;
  });
}
