import { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service";

export class SubscriptionController {
  static async subscribe(req: Request, res: Response): Promise<void> {
    const { subscription, email } = req.body;

    try {
      await SubscriptionService.subscribe(subscription, email);

      res.status(201).json({});
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
