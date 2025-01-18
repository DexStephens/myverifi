import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { privateKeyToAccount } from "viem/accounts";

const DegreeRegistryModule = buildModule("DegreeRegistryModule", (m) => {
  const account = privateKeyToAccount(
    "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0"
  );

  const degreeRegistry = m.contract("DegreeRegistry", [], {
    from: account.address,
  });

  return { degreeRegistry };
});

export default DegreeRegistryModule;
