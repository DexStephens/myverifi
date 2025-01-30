const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox-viem/network-helpers");
const { assert, expect } = require("chai");
import hre from "hardhat";

// const deployDIDRegistry = async () => {
//   const [addr1, addr2, addr3] = await hre.viem.getWalletClients();
//   const walletClient = await hre.viem.getWalletClient(addr2.account.address);
//   const didRegistry = await hre.viem.deployContract("DIDRegistry");
//   const publicClient = await hre.viem.getPublicClient();

//   return { didRegistry, addr1, addr2, addr3, publicClient, walletClient };
// };

describe("DID Registry", function () {
  //Fixture, pretty much auto deploy contract for each test
  async function deployDIDRegistryFixture() {
    const walletClients = await hre.viem.getWalletClients();
    const owner = walletClients[15];
    const addr1 = walletClients[0];

    const didRegistry = await hre.viem.deployContract("DIDRegistry");

    return { didRegistry, owner, addr1 };
  }

  describe("identityOwner", function () {
    it("Should return the identity itself when no owner is set", async function () {
      const { didRegistry, owner } = await loadFixture(
        deployDIDRegistryFixture
      );
      const testIdentity = owner.account.address;
      const actualOwner = await didRegistry.read.identityOwner([testIdentity]);

      expect(actualOwner.toLowerCase()).to.equal(testIdentity.toLowerCase());
    });

    it("Should return the correct owner after ownership change", async function () {
      const { didRegistry, owner, addr1 } = await loadFixture(
        deployDIDRegistryFixture
      );

      try {
        const initialOwner = await didRegistry.read.identityOwner([
          owner.account.address,
        ]);
        console.log("Initial owner:", initialOwner);

        const tx = await didRegistry.write.changeOwner(
          [owner.account.address, addr1.account.address],
          {
            account: owner.account.address,
          }
        );

        const actualOwner = await didRegistry.read.identityOwner([
          owner.account.address,
        ]);

        expect(actualOwner.toLowerCase()).to.equal(
          addr1.account.address.toLowerCase()
        );
      } catch (error) {
        console.error("Error Details: ", error);
        throw error;
      }
    });
  });
});
