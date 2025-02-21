import { Address, isAddress } from "viem";
import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./config/constants.config";

const addressSockets = new Map<Address, Socket>();

export function setupSocketIO(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  });

  const addressWs = io.of(/^\/wallets\/0x[a-zA-z0-9]+$/);

  addressWs.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    const namespace = socket.nsp.name;
    const address = namespace.split("/").pop() as Address;

    if (isAddress(address)) {
      addressSockets.set(address, socket);
    }

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      if (addressSockets.has(address)) {
        addressSockets.delete(address);
      }
      console.log(`Disconnected ${address}`);
    });
  });

  return { addressSockets };
}
