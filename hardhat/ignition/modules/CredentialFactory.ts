import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CredentialFactoryModule = buildModule("CredentialFactoryModule", (m) => {
  const credentialFactory = m.contract("CredentialFactory", []);

  return { credentialFactory };
});

export default CredentialFactoryModule;
