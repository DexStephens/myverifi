import { EventEmitter } from "events";
import { Socket } from "socket.io";
import { Address } from "viem";
import { SOCKET_EVENTS } from "./config/constants.config";
import { stringify } from "bigint-json";

//NEEDSWORK: should we include the full objects here so they don't have to do extra api retrievals??

export const eventBus = new EventEmitter();

export function setupEventBusHandlers(users: Map<Address, Socket>) {
  eventBus.on(
    SOCKET_EVENTS.CONTRACT_CREATION,
    ({ address, contract_address }) => {
      const socket = users.get(address);

      if (socket !== undefined) {
        socket.emit(SOCKET_EVENTS.CONTRACT_CREATION, { contract_address });
      }
    }
  );

  eventBus.on(
    SOCKET_EVENTS.CREDENTIAL_CREATION,
    ({ address, id, name, token_id, issuer_id }) => {
      const socket = users.get(address);

      if (socket !== undefined) {
        const payload = stringify({
          id,
          name,
          token_id,
          issuer_id,
        });
        socket.emit(SOCKET_EVENTS.CREDENTIAL_CREATION, JSON.parse(payload));
      }
    }
  );

  eventBus.on(
    SOCKET_EVENTS.CREDENTIAL_ISSUANCE,
    ({ address, id, holder_id, credential_type_id, credential_type }) => {
      const socket = users.get(address);

      if (socket !== undefined) {
        const payload = stringify({
          id,
          holder_id,
          credential_type_id,
          credential_type,
        });

        socket.emit(SOCKET_EVENTS.CREDENTIAL_ISSUANCE, JSON.parse(payload));
      }
    }
  );

  console.log("Event listeners set up!");
}
