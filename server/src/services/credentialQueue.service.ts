import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ChainUtils } from "../utils/chain.util";
import { eventBus } from "../busHandlers";
import { SOCKET_EVENTS } from "../config/constants.config";

export interface QueuedCredentialType {
  email: string;
  title: string;
  cid: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

class CredentialTypeQueue {
  private static instance: CredentialTypeQueue;
  private userQueues: Map<
    string,
    {
      queue: QueuedCredentialType[];
      isProcessing: boolean;
    }
  > = new Map();

  private constructor() {}

  static getInstance(): CredentialTypeQueue {
    if (!CredentialTypeQueue.instance) {
      CredentialTypeQueue.instance = new CredentialTypeQueue();
    }
    return CredentialTypeQueue.instance;
  }

  enqueue(email: string, title: string, cid: string) {
    if (!this.userQueues.has(email)) {
      this.userQueues.set(email, {
        queue: [],
        isProcessing: false,
      });

      this.processUserQueue(email);
    }

    const userQueue = this.userQueues.get(email)!;
    userQueue.queue.push({
      email,
      title,
      cid,
      status: "pending",
      addedAt: new Date(),
    });

    this.emitQueueUpdate(email);
    console.log(`Enqueued credential type: ${title} for email: ${email}`);
  }

  getPendingByEmail(email: string): QueuedCredentialType[] {
    const userQueue = this.userQueues.get(email);

    if (!userQueue) return [];

    return userQueue.queue.filter(
      (item) => item.status === "pending" || item.status === "processing"
    );
  }

  private async emitQueueUpdate(email: string) {
    try {
      const user = await UserModel.findUserByEmail(email);
      if (user?.wallet?.address) {
        const pendingCredentials = this.getPendingByEmail(email);

        eventBus.emit(SOCKET_EVENTS.CREDENTIAL_QUEUE_UPDATE, {
          address: user.wallet.address,
          pendingCredTypes: pendingCredentials,
        });
      }
    } catch (error) {
      console.error("Error emitting queue update: ", error);
    }
  }

  private async processUserQueue(email: string) {
    const processQueue = async () => {
      const userQueue = this.userQueues.get(email);
      if (!userQueue) return;

      while (true) {
        if (userQueue.queue.length === 0 || userQueue.isProcessing) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        userQueue.isProcessing = true;
        const item = userQueue.queue[0];

        try {
          item.status = "processing";

          await this.emitQueueUpdate(email);

          const user = await UserModel.findUserByEmail(email);
          if (!user || !user.issuer) {
            throw new Error(`No isuer found for email: ${email}`);
          }

          await ChainUtils.createCredentialType(
            user.wallet.privateKey as Address,
            user.issuer.contract_address as Address,
            item.title,
            item.cid
          );

          item.status = "completed";
          userQueue.queue.shift();

          await this.emitQueueUpdate(email);

          console.log(
            `Completed credential type: ${item.title} for email ${email}`
          );

          if (userQueue.queue.length === 0) {
            this.userQueues.delete(email);
            await this.emitQueueUpdate(email);
            break;
          }
        } catch (error) {
          console.error("Error processing credential type: ", error);
          item.status = "failed";
          item.error = error.message;
          userQueue.queue.shift();
          await this.emitQueueUpdate(email);
        } finally {
          userQueue.isProcessing = false;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    processQueue().catch((error) => {
      console.error(`Error in queue processing for ${email}:`, error);
    });
  }
}

export const credentialQueue = CredentialTypeQueue.getInstance();
