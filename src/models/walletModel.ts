import mongoose, { Model, Schema } from "mongoose";
import type { WalletInterface } from "../interfaces/models/IWallet";

const walletSchema: Schema<WalletInterface> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const walletModel: Model<WalletInterface> = mongoose.model<WalletInterface>(
  "wallet",
  walletSchema
);

export default walletModel;
