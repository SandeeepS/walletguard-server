import mongoose, { Model, Schema } from "mongoose";
import type { TransactionInterface } from "../interfaces/models/ITransaction";

const transactionSchema: Schema<TransactionInterface> = new Schema(
  {
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
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const transactionModel: Model<TransactionInterface> =
  mongoose.model<TransactionInterface>("transactions", transactionSchema);

export default transactionModel;
