import mongoose, { Model, Schema } from "mongoose";
import type { WalletInterface } from "../interfaces/models/IWallet";


//schema for wallet 
const walletSchema: Schema<WalletInterface> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique:true,
      
    },
    balance: {
      type: Number,
      required: true,
      default:0,
      min:0,
    },
    currency: {
      type: String,
      default: "INR",
      required:true,
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
