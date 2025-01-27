import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      mining: {
        auto: true,
      },
    },
    // sepolia: {
    //   url: "???", //This is a url that I can get through alchemy for their testnet??
    //   accounts: ["???"], //This should be the private key
    // },
  },
};

export default config;
