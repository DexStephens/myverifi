import { metaMask } from "wagmi/connectors";
//import DIDRegistryABI from "../../../hardhat/artifacts/contracts/DIDRegistry.sol/DIDRegistry.json";
//import deployedAddress from "../../../hardhat/ignition/deployments/chain-31337/deployed_addresses.json";

import { http, createConfig } from "wagmi";
import { hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [hardhat],
  connectors: [metaMask()],
  transports: {
    [hardhat.id]: http(),
  },
});
