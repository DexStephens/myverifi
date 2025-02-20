import { createServer } from "http";
import app from "./expressApp";
import { startBlockchainListener } from "./chainEvents";
import prisma from "./config/db.config";
import { setupSocketIO } from "./socket";
import { setupEventBusHandlers } from "./busHandlers";

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

      //NEEDSWORK: load in the initial contract factory address here
      startBlockchainListener("0xd0f350b13465b5251bb03e4bbf9fa1dbc4a378f3");
    });
  } catch (e) {
    console.error("Failed to start server: ", e);
    process.exit(1);
  }
};

startServer();
