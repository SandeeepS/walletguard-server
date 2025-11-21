import mongoose from "mongoose";

export interface UserInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  role: string;
  walletId:mongoose.Types.ObjectId;
  profilePicture: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

