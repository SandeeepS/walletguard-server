import type { NextFunction, Request, Response } from "express";
import type { IWalletController } from "../../interfaces/controllers/IWalletController";
import { toPaise } from "../../utils/toPaise";
import type { IWalletService } from "../../interfaces/services/IWalletService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";

const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// wallet controller for handling the wallet operations 
class WalletController implements IWalletController {
  constructor(private _walletService: IWalletService) {
    this._walletService = _walletService;
  }

  async deposit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, amount } = req.body;
      console.log("userId and amount from deposit in the walletControll is ",userId,amount);
      if (!userId) {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized! User id is required",
          data: null,
        } as ApiResponse);
        return;
      }

      const amountNum = Number(amount);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Invalid amount! Amount must be a positive number",
          data: null,
        } as ApiResponse);
        return;
      }

      const amountPaise = toPaise(amountNum);
      const transaction = await this._walletService.deposit(
        userId,
        amountPaise
      );


      if (!transaction) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Deposit failed",
          data: null,
        } as ApiResponse);
        return;
      }

      res.status(OK).json({
        success: true,
        message: "Amount deposited successfully",
        data: transaction,
      } as ApiResponse);
    } catch (err: any) {
      next(err);
    }
  }

  async withdraw(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, amount } = req.body;
      console.log("userId and amount in the walletController ", userId, amount);
      if (!userId) {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized,User ID is required",
          data: null,
        } as ApiResponse);
        return;
      }

      const amountNumber = Number(amount);
      if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Invalid amount,Amount must be a positive number",
          data: null,
        } as ApiResponse);
        return;
      }

      const response = await this._walletService.withdraw(userId, amountNumber);

      if (!response) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Withdrawal failed,Insufficient funds or wallet not found",
          data: null,
        } as ApiResponse);
        return;
      }

      res.status(OK).json({
        success: true,
        message: "Amount withdrawn successfully",
        data: response,
      } as ApiResponse);
    } catch (err) {
      next(err);
    }
  }

  async balance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "User id is required",
          data: null,
        } as ApiResponse);
        return;
      }

      const result = await this._walletService.getBalance(userId as string);

      if (!result) {
        res.status(NOT_FOUND).json({
          success: false,
          message: "Wallet not found",
          data: null,
        } as ApiResponse);
        return;
      }

      res.status(OK).json({
        success: true,
        message: "Balance retrieved successfully",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  //to get transaction history
  async getTransactionHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId) {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "User ID is required",
          data: null,
        } as ApiResponse);
        return;
      }

      const result = await this._walletService.getTransactionHistory(
        userId as string
      );

      if (!result || (Array.isArray(result) && result.length === 0)) {
        res.status(NOT_FOUND).json({
          success: false,
          message: "No transaction history found",
          data: null,
        } as ApiResponse);
        return;
      }

      res.status(OK).json({
        success: true,
        message: "Transaction history retrieved successfully",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default WalletController;
