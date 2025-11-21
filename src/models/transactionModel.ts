import mongoose, { Model, Schema } from "mongoose";
import type { TransactionInterface } from "../interfaces/models/ITransaction";


//schema for transactions 
const transactionSchema: Schema<TransactionInterface> = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["DEPOSIT", "WITHDRAW"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

const transactionModel: Model<TransactionInterface> =
  mongoose.model<TransactionInterface>("transactions", transactionSchema);

export default transactionModel;
