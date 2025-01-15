import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("DegreeRegistry", function () {
  it("Allow for publishing of university", async function () {
    const degreeRegistry = await hre.viem.deployContract("DegreeRegistry");

    expect(false).to.equal(true);
  });
});
