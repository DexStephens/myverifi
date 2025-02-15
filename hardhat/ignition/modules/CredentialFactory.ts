import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { privateKeyToAccount } from "viem/accounts";

const CredentialFactoryModule = buildModule("CredentialFactoryModule", (m) => {
  //This is where we would want to put myVerifi's account stuff so it's the owner of the contract
  const account = privateKeyToAccount(
    "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0"
  );

  const credentialFactory = m.contract("CredentialFactory", [], {
    from: account.address,
  });

  return { credentialFactory };
});

export default CredentialFactoryModule;
