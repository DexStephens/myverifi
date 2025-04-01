import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ChainUtils } from "../utils/chain.util";
import { eventBus } from "../busHandlers";
import { SOCKET_EVENTS } from "../config/constants.config";
import { CredentialTypeModel } from "../models/credentialType.model";
import { HolderModel } from "../models/holder.model";

export interface QueuedCredentialType {
  email: string;
  title: string;
  cid: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

export interface QueuedIssuanceType {
  credential_id: number;
  credential_name: string;
  holder_emails: string[];
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

interface PendingQueueItems {
  pendingCredTypes: QueuedCredentialType[];
  pendingIssuances: QueuedIssuanceType[];
}

class CredentialQueue {
  private static instance: CredentialQueue;
  private userQueues: Map<
    string,
    {
      queue: (QueuedCredentialType | QueuedIssuanceType)[];
      isProcessing: boolean;
    }
  > = new Map();

  private constructor() {}

  static getInstance(): CredentialQueue {
    if (!CredentialQueue.instance) {
      CredentialQueue.instance = new CredentialQueue();
    }
    return CredentialQueue.instance;
  }

  private enqueue(
    email: string,
    item: QueuedCredentialType | QueuedIssuanceType
  ) {
    if (!this.userQueues.has(email)) {
      this.userQueues.set(email, {
        queue: [],
        isProcessing: false,
      });
      this.processUserQueue(email);
    }

    const userQueue = this.userQueues.get(email)!;
    userQueue.queue.push(item);
    this.emitQueueUpdate(email);

    if ("cid" in item) {
      console.log(
        `Enqueued credential type: ${item.title} for issuer: ${email}`
      );
    } else {
      if (item.holder_emails.length === 1) {
        console.log(
          `Enqueued issuancd of ${item.credential_name} from ${email} to ${item.holder_emails[0]}`
        );
      } else {
        console.log(
          `Enqueued batch issuance of ${item.credential_name} from ${email}`
        );
      }
    }
  }

  enqueueCredentialType(email: string, title: string, cid: string) {
    this.enqueue(email, {
      email,
      title,
      cid,
      status: "pending",
      addedAt: new Date(),
    });
  }

  enqueueIssuance(
    issuer_email: string,
    credential_id: number,
    credential_name: string,
    holder_emails: string[]
  ) {
    this.enqueue(issuer_email, {
      credential_id,
      credential_name,
      holder_emails,
      status: "pending",
      addedAt: new Date(),
    });
  }

  getPendingByEmail(email: string): PendingQueueItems {
    const userQueue = this.userQueues.get(email);

    if (!userQueue) return { pendingCredTypes: [], pendingIssuances: [] };

    const pendingItems = userQueue.queue.filter(
      (item) => item.status === "pending" || item.status === "processing"
    );

    return {
      pendingCredTypes: pendingItems.filter(
        (item): item is QueuedCredentialType => "cid" in item
      ),
      pendingIssuances: pendingItems.filter(
        (item): item is QueuedIssuanceType => "credential_id" in item
      ),
    };
  }

  private async emitQueueUpdate(email: string) {
    try {
      const user = await UserModel.findUserByEmail(email);
      if (user?.wallet?.address) {
        const { pendingCredTypes, pendingIssuances } =
          this.getPendingByEmail(email);

        eventBus.emit(SOCKET_EVENTS.CREDENTIAL_QUEUE_UPDATE, {
          address: user.wallet.address,
          pendingCredTypes,
          pendingIssuances,
        });
      }
    } catch (error) {
      console.error("Error emitting credentialqueue update: ", error);
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

          if ("cid" in item) {
            await this.processCredentialType(email, item);
          } else {
            await this.processIssuance(item);
          }

          item.status = "completed";
          userQueue.queue.shift();

          await this.emitQueueUpdate(email);

          console.log(`Completed processing of ${item} for email ${email}`);

          if (userQueue.queue.length === 0) {
            this.userQueues.delete(email);
            await this.emitQueueUpdate(email);
            break;
          }
        } catch (error) {
          console.error("Error processing the queue item: ", error);
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

  private async processCredentialType(
    email: string,
    item: QueuedCredentialType
  ) {
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
  }

  private async processIssuance(item: QueuedIssuanceType) {
    const credentialType = await CredentialTypeModel.findById(
      item.credential_id
    );
    if (!credentialType) {
      throw new Error(`No credential type found for id: ${item.credential_id}`);
    }
    const holders = await HolderModel.findByEmails(item.holder_emails);
    if (holders.length === 1) {
      const holder = holders[0];
      await ChainUtils.issueCredential(
        credentialType.issuer.user.wallet.privateKey as Address,
        credentialType.issuer.contract_address as Address,
        holder.user.wallet.address as Address,
        credentialType.token_id
      );
    } else {
      await ChainUtils.batchIssueCredential(
        credentialType.issuer.user.wallet.privateKey as Address,
        credentialType.issuer.contract_address as Address,
        holders.map((holder) => holder.user.wallet.address as Address),
        credentialType.token_id
      );
    }
  }
}

export const credentialQueue = CredentialQueue.getInstance();
