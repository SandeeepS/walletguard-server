import type mongoose from "mongoose";

export interface TransactionInterface {
  _id: mongoose.Types.ObjectId;
  transactionId:string;
  userId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
}
