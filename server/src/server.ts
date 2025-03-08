import { createServer } from "http";
import app from "./expressApp";
import { startBlockchainListener } from "./chainEvents";
import prisma from "./config/db.config";
import { setupSocketIO } from "./socket";
import { setupEventBusHandlers } from "./busHandlers";
import { Address } from "viem";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    prisma.$connect().then(() => {
      //Setup socket server that stores address based connections
      const server = createServer(app);
      const { addressSockets } = setupSocketIO(server);

      // Setup event bus to handle different contract events and communicate with the sockets that need to know
      setupEventBusHandlers(addressSockets);

      //Start our web server that responds to api request
      server.listen(3000, () => {
        console.log("Server running on port 3000");
      });

      //Start listening to blockchain events
      startBlockchainListener(
        process.env.SEPOLIA_CREDENTIAL_FACTORY_ADDRESS as Address
      );
    });
  } catch (e) {
    console.error("Failed to start server: ", e);
    process.exit(1);
  }
};

startServer();
