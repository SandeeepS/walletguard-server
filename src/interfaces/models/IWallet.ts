import type mongoose from "mongoose";

export interface WalletInterface {
      _id: mongoose.Types.ObjectId;
      userId:mongoose.Types.ObjectId;
      balance:number;
      currency:string
      isDeleted:false;
}