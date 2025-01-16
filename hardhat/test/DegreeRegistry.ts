import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const deploy = async () => {
  const publicClient = await hre.viem.getPublicClient();

  const [owner, otherAccount] = await hre.viem.getWalletClients();

  const walletClient = await hre.viem.getWalletClient(
    otherAccount.account.address
  );

  const degreeRegistry = await hre.viem.deployContract("DegreeRegistry", [], {
    client: {
      wallet: owner,
    },
  });

  return { degreeRegistry, owner, otherAccount, publicClient, walletClient };
};

describe("DegreeRegistry", function () {
  describe("addUniversity", function () {
    it("Allow for publishing of university", async function () {
      const { degreeRegistry, owner, walletClient } = await loadFixture(deploy);

      await expect(
        walletClient.writeContract({
          abi: degreeRegistry.abi,
          address: degreeRegistry.address,
          functionName: "addUniversity",
          args: [
            "0041",
            "Brigham Young University",
            "0x0000000000000000000000000000000000000001",
          ],
          account: owner.account,
        })
      ).to.be.fulfilled;
    });

    it("OtherAccount fail to add university not as owner", async function () {
      const { degreeRegistry, otherAccount, walletClient } = await loadFixture(
        deploy
      );

      await expect(
        walletClient.writeContract({
          abi: degreeRegistry.abi,
          address: degreeRegistry.address,
          functionName: "addUniversity",
          args: [
            "0041",
            "Brigham Young University",
            "0x0000000000000000000000000000000000000001",
          ],
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });
    it("Can not re-add university", async function () {
      const { degreeRegistry, owner, walletClient } = await loadFixture(deploy);

      await expect(
        walletClient.writeContract({
          abi: degreeRegistry.abi,
          address: degreeRegistry.address,
          functionName: "addUniversity",
          args: [
            "0041",
            "Brigham Young University",
            "0x0000000000000000000000000000000000000001",
          ],
          account: owner.account,
        })
      ).to.be.fulfilled;

      await expect(
        walletClient.writeContract({
          abi: degreeRegistry.abi,
          address: degreeRegistry.address,
          functionName: "addUniversity",
          args: [
            "0041",
            "Brigham Young University",
            "0x0000000000000000000000000000000000000001",
          ],
          account: owner.account,
        })
      ).to.be.rejected;
    });
  });

  describe("assignDegree", function () {
    it("Should successfully assign degree", async function () {
      const { walletClient, degreeRegistry, owner, otherAccount } =
        await loadFixture(deploy);

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          otherAccount.account.address,
        ],
        account: owner.account,
      });

      await expect(
        walletClient.writeContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "assignDegree",
          args: [
            "0x0000000000000000000000000000000000000001",
            "0041",
            "Information Systems, Management",
            "Master's Degree",
            "https://test.com",
          ],
          account: otherAccount.account,
        })
      ).to.be.fulfilled;
    });
    it("Should revert with non-existent university", async function () {
      const { walletClient, degreeRegistry, owner, otherAccount } =
        await loadFixture(deploy);

      await expect(
        walletClient.writeContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "assignDegree",
          args: [
            "0x0000000000000000000000000000000000000001",
            "0041",
            "Information Systems, Management",
            "Master's Degree",
            "https://test.com",
          ],
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });
    it("Should revert with improper msg sender", async function () {
      const { walletClient, degreeRegistry, owner, otherAccount } =
        await loadFixture(deploy);

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: ["0041", "Brigham Young University", owner.account.address],
        account: owner.account,
      });

      await expect(
        walletClient.writeContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "assignDegree",
          args: [
            "0x0000000000000000000000000000000000000001",
            "0041",
            "Information Systems, Management",
            "Master's Degree",
            "https://test.com",
          ],
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });
    it("Should revert if not a proper link", async function () {
      const { walletClient, degreeRegistry, owner, otherAccount } =
        await loadFixture(deploy);

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          otherAccount.account.address,
        ],
        account: owner.account,
      });

      await expect(
        walletClient.writeContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "assignDegree",
          args: [
            "0x0000000000000000000000000000000000000001",
            "0041",
            "Information Systems, Management",
            "Master's Degree",
            "test.com",
          ],
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });
    it("Should add a second degree to an existing member correctly", async function () {
      const { walletClient, degreeRegistry, owner, otherAccount } =
        await loadFixture(deploy);

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          otherAccount.account.address,
        ],
        account: owner.account,
      });

      // First Degree
      await walletClient.writeContract({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        functionName: "assignDegree",
        args: [
          "0x0000000000000000000000000000000000000001",
          "0041",
          "Information Systems",
          "Bachelor's Degree",
          "https://test.com",
        ],
        account: otherAccount.account,
      });

      // Second Degree
      await expect(
        walletClient.writeContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "assignDegree",
          args: [
            "0x0000000000000000000000000000000000000001",
            "0041",
            "Information Systems, Management",
            "Master's Degree",
            "https://test.com",
          ],
          account: otherAccount.account,
        })
      ).to.be.fulfilled;
    });
  });

  describe("getDegrees", function () {
    it("Should return all degrees for a user", async function () {
      const {
        publicClient,
        walletClient,
        degreeRegistry,
        owner,
        otherAccount,
      } = await loadFixture(deploy);

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          otherAccount.account.address,
        ],
        account: owner.account,
      });

      // First Degree
      await walletClient.writeContract({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        functionName: "assignDegree",
        args: [
          "0x0000000000000000000000000000000000000001",
          "0041",
          "Information Systems",
          "Bachelor's Degree",
          "https://test.com",
        ],
        account: otherAccount.account,
      });

      // Second Degree
      await walletClient.writeContract({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        functionName: "assignDegree",
        args: [
          "0x0000000000000000000000000000000000000001",
          "0041",
          "Information Systems, Management",
          "Master's Degree",
          "https://test.com",
        ],
        account: otherAccount.account,
      });

      const degrees = await publicClient.readContract({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        functionName: "getDegrees",
        args: ["0x0000000000000000000000000000000000000001"],
      });

      expect(degrees.length).to.eq(2);
    });
    it("Should revert for non-existent recipient", async function () {
      const { publicClient, degreeRegistry } = await loadFixture(deploy);

      await expect(
        publicClient.readContract({
          address: degreeRegistry.address,
          abi: degreeRegistry.abi,
          functionName: "getDegrees",
          args: ["0x0000000000000000000000000000000000000001"],
        })
      ).to.be.rejected;
    });
  });

  describe("events", function () {
    it("Emits University Added Event", async function () {
      const { publicClient, walletClient, owner, degreeRegistry } =
        await loadFixture(deploy);

      const unwatch = publicClient.watchContractEvent({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        eventName: "UniversityAdded",
        onLogs: (logs) => console.log(logs),
      });

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          "0x0000000000000000000000000000000000000001",
        ],
        account: owner.account,
      });

      unwatch();

      const logs = await publicClient.getLogs();

      expect(logs.length).to.be.gt(0);
    });
    it("Emits Degree Earned Event", async function () {
      const {
        publicClient,
        walletClient,
        owner,
        otherAccount,
        degreeRegistry,
      } = await loadFixture(deploy);

      const unwatch = publicClient.watchContractEvent({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        eventName: "UniversityAdded",
        onLogs: (logs) => console.log(logs),
      });

      await walletClient.writeContract({
        abi: degreeRegistry.abi,
        address: degreeRegistry.address,
        functionName: "addUniversity",
        args: [
          "0041",
          "Brigham Young University",
          otherAccount.account.address,
        ],
        account: owner.account,
      });

      // First Degree
      await walletClient.writeContract({
        address: degreeRegistry.address,
        abi: degreeRegistry.abi,
        functionName: "assignDegree",
        args: [
          "0x0000000000000000000000000000000000000001",
          "0041",
          "Information Systems",
          "Bachelor's Degree",
          "https://test.com",
        ],
        account: otherAccount.account,
      });

      unwatch();

      const logs = await publicClient.getLogs();

      expect(logs.length).to.eq(1);
    });
  });
});
