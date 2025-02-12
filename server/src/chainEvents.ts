import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { credentialFactoryAbi } from "./utils/abi.util";

//NEEDSWORK: load contract addresses according to the environment

export default class ChainEvents {
  private unwatch?: () => void;
  private unwatch2?: () => void;
  private unwatch3?: () => void;

  listen() {
    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });

    this.unwatch = publicClient.watchContractEvent({
      address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
      abi: credentialFactoryAbi,
      eventName: "InstitutionDeployed",
      onLogs: (logs) => this.credentialContractCreated(logs),
    });

    this.unwatch2 = publicClient.watchContractEvent({
      address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
      abi: credentialFactoryAbi,
      eventName: "InstitutionDeployed",
      onLogs: (logs) => this.credentialTypeAdded(logs),
    });

    this.unwatch3 = publicClient.watchContractEvent({
      address: "0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3",
      abi: credentialFactoryAbi,
      eventName: "InstitutionDeployed",
      onLogs: (logs) => this.credentialIssued(logs),
    });
  }

  shutdown() {
    if (this.unwatch) {
      this.unwatch();
      console.log("Stopped contract listener.");
    }
    if (this.unwatch2) {
      this.unwatch2();
      console.log("Stopped credential type listener.");
    }
    if (this.unwatch3) {
      this.unwatch3();
      console.log("Stopped credential issue listener.");
    }
  }

  credentialContractCreated(logs: unknown[]) {
    console.log(logs);
  }

  credentialTypeAdded(logs: unknown[]) {
    console.log(logs);
  }

  credentialIssued(logs: unknown[]) {
    console.log(logs);
  }
}
