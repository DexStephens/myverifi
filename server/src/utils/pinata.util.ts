import { PinataSDK } from "pinata";
import fs from "fs";
export class PinataUtil {
  private static getPinataInstance(): PinataSDK {
    if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY_URL) {
      throw new Error("Missing required Pinata environment variables");
    }

    return new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_GATEWAY_URL,
    });
  }

  static async upload(file: Express.Multer.File) {
    try {
      const blob = new Blob([fs.readFileSync(file.path)]);
      const fileToUpload = new File([blob], file.originalname, {
        type: file.mimetype,
      });

      const pinata = this.getPinataInstance();
      const { cid } = await pinata.upload.file(fileToUpload);

      return cid;
    } catch {
      return null;
    }
  }

  static async get(cid: string) {
    try {
      const pinata = this.getPinataInstance();
      const file = await pinata.gateways.get(cid);
      return file.data;
    } catch {
      return null;
    }
  }
}
