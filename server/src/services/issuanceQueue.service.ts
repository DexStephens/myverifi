import { Address } from "viem";
import { UserModel } from "../models/user.model";
import { ChainUtils } from "../utils/chain.util";
import { eventBus } from "../busHandlers";
import { SOCKET_EVENTS } from "../config/constants.config";
import { HolderModel } from "../models/holder.model";
import { CredentialTypeModel } from "../models/credentialType.model";

export interface QueuedIssuanceType {
  credential_id: number;
  credential_name: string;
  holder_emails: string[];
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

class IssuanceQueue {
  private static instance: IssuanceQueue;
  private userQueues: Map<
    string,
    {
      queue: QueuedIssuanceType[];
      isProcessing: boolean;
    }
  > = new Map();

  private constructor() {}

  static getInstance(): IssuanceQueue {
    if (!IssuanceQueue.instance) {
      IssuanceQueue.instance = new IssuanceQueue();
    }
    return IssuanceQueue.instance;
  }

  enqueue(
    issuer_email: string,
    credential_id: number,
    credential_name: string,
    holder_emails: string[]
  ) {
    if (!this.userQueues.has(issuer_email)) {
      this.userQueues.set(issuer_email, {
        queue: [],
        isProcessing: false,
      });

      this.processUserQueue(issuer_email);
    }

    const userQueue = this.userQueues.get(issuer_email)!;
    userQueue.queue.push({
      credential_id,
      credential_name,
      holder_emails,
      status: "pending",
      addedAt: new Date(),
    });

    if (holder_emails.length === 1) {
      const holder_email = holder_emails[0];
      this.emitQueueUpdate(issuer_email);
      console.log(
        `Enqueued issuance of ${credential_name} from ${issuer_email} to ${holder_email}`
      );
    } else {
      this.emitQueueUpdate(issuer_email);
      console.log(
        `Enqueued batch issuance of ${credential_name} from ${issuer_email}`
      );
    }
  }

  getPendingByEmail(issuer_email: string): QueuedIssuanceType[] {
    const userQueue = this.userQueues.get(issuer_email);

    if (!userQueue) return [];

    return userQueue.queue.filter(
      (item) => item.status === "pending" || "processing"
    );
  }

  private async emitQueueUpdate(issuer_email: string) {
    try {
      const user = await UserModel.findUserByEmail(issuer_email);
      if (user?.wallet?.address) {
        const pendingIssuances = this.getPendingByEmail(issuer_email);

        eventBus.emit(SOCKET_EVENTS.ISSUANCE_QUEUE_UPDATE, {
          address: user.wallet.address,
          pendingIssuances,
        });
      }
    } catch (error) {
      console.error("Error emitting issuance queue update: ", error);
    }
  }

  private async processUserQueue(issuer_email: string) {
    const processQueue = async () => {
      const userQueue = this.userQueues.get(issuer_email);
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

          await this.emitQueueUpdate(issuer_email);

          const credentialType = await CredentialTypeModel.findById(
            item.credential_id
          );

          if (!credentialType) {
            throw new Error(
              `No credential type found for id: ${item.credential_id}`
            );
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

          item.status = "completed";
          userQueue.queue.shift();

          await this.emitQueueUpdate(issuer_email);

          console.log(
            `Completed issuance of ${credentialType.name} from ${issuer_email}.`
          );

          if (userQueue.queue.length === 0) {
            this.userQueues.delete(issuer_email);
            await this.emitQueueUpdate(issuer_email);
            break;
          }
        } catch (error) {
          console.error("Error processing credential issuance: ", error);
          item.status = "failed";
          item.error = error.message;
          userQueue.queue.shift();
          await this.emitQueueUpdate(issuer_email);
        } finally {
          userQueue.isProcessing = false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    processQueue().catch((error) => {
      console.error(`Error in queue processing for ${issuer_email}:`, error);
    });
  }
}

export const issuanceQueue = IssuanceQueue.getInstance();
