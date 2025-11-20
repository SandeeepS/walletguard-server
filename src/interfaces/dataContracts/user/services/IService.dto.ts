import type mongoose from "mongoose";

export interface IUserSingupResponse {
  success: boolean;
  message: string;
  data?: IUserSignupDataResponse | null;
  access_token?: string;
  refresh_token?: string;
}

export interface IUserSignupDataResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IUserLoginResponse {
  success: boolean;
  message: string;
  data?: ILoginResponse;
  token?: string;
  refresh_token?: string;
}

export interface ILoginResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IEmailExistCheck {
  email: string;
}

export interface INewDetails {
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface ISingUp {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserLogin {
  email: string;
  password: string;
  role: string;
}
