import app from "./app";
import prisma from "./utils/db";

const startServer = async () => {
  try {
    prisma.$connect().then(() => {
      app.listen(3000, () => {
        console.log("Server running on port 3000");
      });
    });
  } catch (e) {
    console.error("Failed to start server: ", e);
    process.exit(1);
  }
};

startServer();
