#!/bin/bash

# Navigate to the Hardhat directory and start the Hardhat node in the background
cd ../hardhat
npx hardhat node &

# Wait for the node to be up
echo "Waiting for Hardhat node to start..."
while ! nc -z localhost 8545; do
  sleep 1
done

echo "Hardhat node is up. Deploying contract..."

# Deploy the contract to the running Hardhat node
npx hardhat ignition deploy ./ignition/modules/DegreeRegistry.ts --network localhost &

# Navigate to the client directory and start the Vite development server
cd ../client
vite
