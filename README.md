# myverifi

Before starting, please run npm install separately in all 3 directories, they are each their own npm project.

Client:
Start up and run development: npm run contract-dev

This starts the client as well as spins up the hardhat server, and deploys the test DegreeRegistry contract to the hardhat server.

You can replicate this by running:
  1. npm run dev in client
  2. In a separate terminal, run npx hardhat node
  3. Once the chain is up and running, open another terminal and run npx hardhat ignition deploy ./ignition/modules/DegreeRegistry.ts --network localhost

Server:
Start up and run development: npm run dev

Hardhat:
npx hardhat node: to run the chain
npx hardhat ignition deploy ./ignition/modules/DegreeRegistry.ts --network localhost: to deploy a contract to the chain
npx hardhat test: Runs all tests on the smart contracts
npx hardhat ignition deploy ./ignition/modules/Lock.ts (Identifying the contract related ignition in the folder path): Contracts need to be deployed before testing

