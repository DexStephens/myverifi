export function logParser(logs: never[]) {
  logs.forEach((log) => {
    const { args, address, eventName } = log;

    console.log("Event data emitted", args);
    console.log("Address", address);
    console.log("Event name", eventName);
  });
}
