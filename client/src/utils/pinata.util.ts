import { PinataSDK } from "pinata-web3";
export async function uploadJsonToPinata(id: string, data: object) {
  try {
    const pinata = getPinataInstance();

    const { IpfsHash } = await pinata.upload.json(data, {
      metadata: {
        name: id,
      },
    });

    return IpfsHash;
  } catch {
    return null;
  }
}

export async function getJsonDataFromPinata(cid: string) {
  try {
    const pinata = getPinataInstance();

    const { data } = await pinata.gateways.get(cid);

    if (data && !(data instanceof Blob) && typeof data === "object") {
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

function getPinataInstance() {
  return new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
  });
}
