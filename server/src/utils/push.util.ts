import { JsonObject } from "@prisma/client/runtime/library";
import webPush from "web-push";

type IssuancePayload = {
  organization: string;
  requestId: number;
};

type PushPayload = {
  type: "subscription" | "issuance" | "verification";
  data: IssuancePayload;
};

export class PushUtil {
  static async sendPushNotification(
    subscription: JsonObject,
    payload: PushPayload
  ) {
    try {
      const response = await webPush.sendNotification(
        PushUtil.getPushSubscription(subscription),
        JSON.stringify(payload)
      );
      console.log("Push notification sent", response);
    } catch (e) {
      console.log("Error sending push notification", e);
    }
  }

  static getPushSubscription(subscription: JsonObject) {
    if (!("endpoint" in subscription) || !("keys" in subscription)) {
      throw new Error("Invalid subscription object");
    }

    const endpoint = subscription.endpoint as string;
    const keys = subscription.keys as { p256dh: string; auth: string };

    return {
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    };
  }
}

//What messages are we sending? Confirmation of subscription, confirmation of issuance, verification requests
