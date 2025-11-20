import mongoose, { Model, Schema } from "mongoose";
import type { UserInterface } from "../interfaces/models/IUser";

const userSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png",
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const userModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "user",
  userSchema
);

export default userModel;
