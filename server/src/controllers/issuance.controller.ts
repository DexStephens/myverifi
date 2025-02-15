import { Request, Response } from "express";
import { IssuanceService } from "../services/issuance.service";

export class IssuanceController {
  static async create(req: Request, res: Response): Promise<void> {
    const { email, organization } = req.body;
    const file = req.file;

    try {
      await IssuanceService.create(email, organization, file);
      res.status(200).json({
        status: "success",
        data: {},
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async respond(req: Request, res: Response): Promise<void> {
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

  static async address(req: Request, res: Response) {
    const { email, address } = req.body;

    try {
      const success = await IssuanceService.address(email, address);

      if (success) {
        res.status(200).json({
          status: "success",
          data: {},
        });
      } else {
        res.status(400).json({
          status: "error",
          message:
            "Unable to update address due to already added address or not found user",
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
