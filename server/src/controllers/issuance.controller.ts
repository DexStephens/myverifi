import { Request, Response } from "express";
import { IssuanceService } from "../services/issuance.service";

export class IssuanceController {
  static async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      await IssuanceService.create(email);
      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async respond(req: Request, res: Response): Promise<void> {
    console.log("response and request", res, req);
    const { id } = req.params;
    const { did } = req.body;

    try {
      await IssuanceService.respond(id, did);
      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
