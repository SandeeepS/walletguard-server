import type { NextFunction, Request, Response } from "express";
import type { IWalletController } from "../../interfaces/controllers/IWalletController";
import { toPaise } from "../../utils/toPaise";
import type { IWalletService } from "../../interfaces/services/IWalletService";

class WalletController implements IWalletController {
  constructor(private _walletService: IWalletService) {
    this._walletService = _walletService;
  }

  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const { amount } = req.body;
      const amountNum = Number(amount);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid amount" });
      }

      const amountPaise = toPaise(amountNum);

      const transaction = await this._walletService.deposit(
        userId,
        amountPaise
      );

      return res.status(200).json({ success: true, transaction: transaction });
    } catch (err: any) {
      if (err)
        return res.status(400).json({ success: false, message: err.message });
      if (err) {
        return res
          .status(409)
          .json({ success: false, message: "Duplicate transaction" });
      }
      next(err);
    }
  }

  async withdraw(req: Request, res: Response,next:NextFunction) {
    try {
      const { userId } = req.body;
      const amount = Number(req.body.amount);

      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      if (!amount || amount <= 0)
        return res
          .status(400)
          .json({ success: false, message: "Invalid amount" });

      const tx = await this._walletService.withdraw(userId, toPaise(amount));
      return res.status(200).json({ success: true, transaction: tx });
    } catch (err) {
      if (err) {
        return res.status(402).json({ success: false, message: err });
      }
      if (err) {
        return res.status(400).json({ success: false, message: err });
      }
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default WalletController;
