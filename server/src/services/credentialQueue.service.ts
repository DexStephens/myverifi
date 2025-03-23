import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ChainUtils } from "../utils/chain.util";

interface QueuedCredentialType {
  email: string;
  title: string;
  cid: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

class CredentialTypeQueue {
  private static instance: CredentialTypeQueue;
  private queue: QueuedCredentialType[] = [];
  private isProcessing: boolean = false;

  private constructor() {
    this.processQueue();
  }

  static getInstance(): CredentialTypeQueue {
    if (!CredentialTypeQueue.instance) {
      CredentialTypeQueue.instance = new CredentialTypeQueue();
    }
    return CredentialTypeQueue.instance;
  }

  enqueue(email: string, title: string, cid: string) {
    this.queue.push({
      email,
      title,
      cid,
      status: "pending",
      addedAt: new Date(),
    });
    console.log(`Enqueued credential type: ${title} for email: ${email}`);
  }

  getPendingByEmail(email: string): QueuedCredentialType[] {
    return this.queue.filter(
      (item) =>
        item.email === email &&
        (item.status === "pending" || item.status === "processing")
    );
  }

  private async processQueue() {
    while (true) {
      if (this.queue.length === 0 || this.isProcessing) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      this.isProcessing = true;
      const item = this.queue[0];

      try {
        item.status = "processing";

        const user = await UserModel.findUserByEmail(item.email);
        if (!user || !user.issuer) {
          throw new Error(`No issuer found for email: ${item.email}`);
        }

        await ChainUtils.createCredentialType(
          user.wallet.privateKey as Address,
          user.issuer.contract_address as Address,
          item.title,
          item.cid
        );

        item.status = "completed";

        this.queue.shift();
        console.log(
          `Completed credential type: ${item.title} for email: ${item.email}`
        );
      } catch (error) {
        console.error("Error processing credential type: ", error);
        item.status = "failed";
        item.error = error.message;

        this.queue.shift();
      } finally {
        this.isProcessing = false;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export const credentialQueue = CredentialTypeQueue.getInstance();
