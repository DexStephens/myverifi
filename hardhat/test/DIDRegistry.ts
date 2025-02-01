const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox-viem/network-helpers");
const { expect } = require("chai");
import hre from "hardhat";
import { decodeEventLog, fromHex, toHex } from "viem";

//TO RUN THE TEST, GO TO THE HARDHAT DIRECTORY, RUN 'NPX HARDHAT TEST', YOU DON'T NEED TO DEPLOY THEM LOCALLY FIRST THE FIXTURE TAKES CARE OF THAT

describe("DID Registry", function () {
  //Fixture, pretty much auto deploy contract for each test
  async function deployDIDRegistryFixture() {
    const walletClients = await hre.viem.getWalletClients();
    //This is the 16th account the one used to deploy the contracts
    const owner = walletClients[15];
    const addr1 = walletClients[0];
    const addr2 = walletClients[1];
    //This lets you query the event logs which we can use to upload the names and such into our db
    const publicClient = await hre.viem.getPublicClient();
    //deploy the contract
    const didRegistry = await hre.viem.deployContract("DIDRegistry");

    return { didRegistry, owner, addr1, addr2, publicClient };
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

  describe("changeOwner", function () {
    it("Should transfer ownership to provided account", async function () {
      const { didRegistry, owner, addr1, addr2 } = await loadFixture(
        deployDIDRegistryFixture
      );

      try {
        const initialOwner = await didRegistry.read.identityOwner([
          owner.account.address,
        ]);

        //Change owner to addr1
        await didRegistry.write.changeOwner(
          //The account to change ownership, who you want to transfer ownership
          [owner.account.address, addr1.account.address],
          //the message sender
          {
            account: owner.account.address,
          }
        );

        //Change owner to addr2
        await didRegistry.write.changeOwner(
          [owner.account.address, addr2.account.address],
          {
            account: addr1.account.address,
          }
        );

        const actualOwner = await didRegistry.read.identityOwner([
          owner.account.address,
        ]);

        expect(actualOwner.toLowerCase()).to.equal(
          addr2.account.address.toLowerCase()
        );
        expect(actualOwner.toLowerCase()).to.not.equal(
          addr1.account.address.toLowerCase()
        );
      } catch (error) {
        console.error("Error Details: ", error);
        throw error;
      }
    });
  });

  describe("DIDOwnerChanged Event", function () {
    it("Should record the identity with a change in ownership, the new owner, and the block number when ownership was last changed", async function () {
      const { owner, addr1, didRegistry, publicClient } = await loadFixture(
        deployDIDRegistryFixture
      );

      // Change ownership from owner to addr1
      const hash = await didRegistry.write.changeOwner(
        [owner.account.address, addr1.account.address],
        {
          account: owner.account.address,
        }
      );

      // Get transaction receipt
      const receipt = await publicClient.getTransactionReceipt({ hash });

      // Extract logs
      const logs = receipt.logs;

      // Ensure there is exactly one log
      expect(logs.length).to.equal(1);

      // Decode the event log
      const event = decodeEventLog({
        abi: didRegistry.abi,
        data: logs[0].data,
        topics: logs[0].topics,
        eventName: "DIDOwnerChanged",
      });
      // Verify the event arguments
      expect(event.args.identity.toLowerCase()).to.equal(
        owner.account.address.toLowerCase()
      );
      expect(event.args.owner.toLowerCase()).to.equal(
        addr1.account.address.toLowerCase()
      );
      expect(event.args.previousChange).to.equal(0n);
    });
  });

  describe("DIDAttributeChanged Event", function () {
    it("Should record the identity with a change in attributes, the name, value, validTo, and the block number when the attribute was last changed", async function () {
      const { didRegistry, owner, publicClient } = await loadFixture(
        deployDIDRegistryFixture
      );

      const identity = owner.account.address;
      const name = toHex("JohnDoeName", { size: 32 });
      const email = toHex("john.doe@example.com", { size: 32 });
      const value = toHex("Excellent Student", { size: 32 });
      const validity = 7200n; // validity period of 2 hours

      const txHash = await didRegistry.write.setAttribute(
        [identity, name, email, value, validity],
        {
          account: owner.account.address,
        }
      );

      const receipt = await publicClient.getTransactionReceipt({
        hash: txHash,
      });
      const logs = receipt.logs;

      expect(logs.length).to.equal(1);

      const event = decodeEventLog({
        abi: didRegistry.abi,
        data: logs[0].data,
        topics: logs[0].topics,
        eventName: "DIDAttributeChanged",
      });

      const block = await publicClient.getBlock({
        blockHash: receipt.blockHash,
      });
      const blockTimestamp = BigInt(block.timestamp);

      //It has errors here, but they aren't actually errors, they work
      expect(event.args.identity.toLowerCase()).to.equal(
        owner.account.address.toLowerCase()
      );
      expect(event.args.name.toLowerCase()).to.equal(name.toLowerCase());
      expect(event.args.email.toLowerCase()).to.equal(email.toLowerCase());
      expect(event.args.value.toLowerCase()).to.equal(value.toLowerCase());
      expect(event.args.validTo).to.equal(blockTimestamp + validity);
      //how to actually get the values from the event
      //console.log(fromHex(event.args.name, "string"));
      //console.log(fromHex(event.args.email, "string"));
    });
  });
});
