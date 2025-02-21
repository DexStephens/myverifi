import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Address } from "viem";
import { CONSTANTS } from "../config/constants";

export type EventHandlers = {
  [event: string]: (...args: any[]) => void;
};

export const useSocket = (
  address?: Address,
  eventHandlers: EventHandlers = {}
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!address) return;

    const SOCKET_URL = `${import.meta.env.VITE_SOCKET_BASE}${address}`;

    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on(CONSTANTS.SOCKET_EVENTS.CONNECTION, () => {
      console.log("Socket connected for address:", address);
    });

    socketRef.current.on(CONSTANTS.SOCKET_EVENTS.CONNECTION_ERROR, (error) => {
      console.error("Socket connection error:", error);
      console.error("Connection URL:", SOCKET_URL);
    });

    // Set up event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current?.on(event, handler);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        Object.keys(eventHandlers).forEach((event) => {
          socketRef.current?.off(event);
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [address, eventHandlers]);
};
