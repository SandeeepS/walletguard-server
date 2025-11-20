import type { ClientSession } from "mongoose";
import type { IEmailExistCheck, ISaveUser } from "../dataContracts/user/reporitory/IRepository.dto";
import type { UserInterface } from "../models/IUser";

export interface IUserRepository {
  emailExistCheck(data: IEmailExistCheck,session?:ClientSession): Promise<UserInterface | null> 
   saveUser(newDetails: ISaveUser,session?: ClientSession): Promise<UserInterface | null> 
}

