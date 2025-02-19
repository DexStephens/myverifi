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
    if (address === undefined) return;

    console.log("Starting up socket");
    const SOCKET_URL = `${import.meta.env.VITE_SOCKET_BASE}${address}`;
    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
    });

    socketRef.current.on(CONSTANTS.SOCKET_EVENTS.CONNECTION, () => {
      console.log("Connected:", socketRef.current?.id);
    });

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current?.on(event, handler);
    });

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
