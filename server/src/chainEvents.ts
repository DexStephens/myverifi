import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
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

//NEEDSWORK: load contract addresses according to the environment

export default class ChainEvents {
  listen() {
    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });

    publicClient.watchContractEvent({
      address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
      abi: credentialFactoryAbi,
      eventName: "InstitutionDeployed",
      onLogs: (logs) =>
        ChainService.onContractCreated(
          this.#parseLogs<ContractCreationArgs>(logs as never)
        ),
    });

    publicClient.watchContractEvent({
      address: "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
      abi: institutionCredentialAbi,
      eventName: "CredentialCreated",
      onLogs: (logs) =>
        ChainService.onCredentialCreation(
          this.#parseLogs<CredentialCreationArgs>(logs as never)
        ),
    });

    publicClient.watchContractEvent({
      address: "0xCa62B7655F46283bC4BC044893DE20C42f848b35",
      abi: institutionCredentialAbi,
      eventName: "CredentialIssued",
      onLogs: (logs) =>
        ChainService.onCredentialIssue(
          this.#parseLogs<CredentialIssuanceArgs>(logs as never, (log) => {
            const { address } = log;
            return { contractAddress: address };
          })
        ),
    });
  }

  #parseLogs<T>(
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
}
