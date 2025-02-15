import app from "./app";
import ChainEvents from "./chainEvents";
import prisma from "./config/db.config";

const startServer = async () => {
  try {
    prisma.$connect().then(() => {
      app.listen(3000, () => {
        console.log("Server running on port 3000");
      });

      //Listener for chain events that works with our db accordingly
      new ChainEvents().listen();
    });
  } catch (e) {
    console.error("Failed to start server: ", e);
    process.exit(1);
  }
};

startServer();
