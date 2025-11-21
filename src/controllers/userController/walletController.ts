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
      next(err);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, amount } = req.body;
      console.log("userId and amount in the walletController ", userId, amount);

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const amountNumber = Number(amount);
      if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid amount" });
      }

      const response = await this._walletService.withdraw(userId, amountNumber);

      if (response) {
        return res.status(200).json({ success: true, data: response });
      }
      return res.status(400).json({
        success: false,
        message: "Withdrawal failed (insufficient funds or wallet not found)",
      });
    } catch (err) {
      next(err);
    }
  }

  async balance(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      const result = await this._walletService.getBalance(userId as string);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Balance retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      const result = await this._walletService.getTransactionHistory(
        userId as string
      );
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "History found  ", data: result });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default WalletController;
