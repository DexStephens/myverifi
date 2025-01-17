import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DegreeRegistryModule = buildModule("DegreeRegistryModule", (m) => {
  const degreeRegistry = m.contract("DegreeRegistry", []);

  return { degreeRegistry };
});

export default DegreeRegistryModule;
