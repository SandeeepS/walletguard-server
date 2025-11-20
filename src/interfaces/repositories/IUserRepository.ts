import type { IEmailExistCheck, ISaveUser } from "../dataContracts/user/reporitory/IRepository.dto";
import type { UserInterface } from "../models/IUser";

export interface IUserRepository {
   emailExistCheck(data: IEmailExistCheck): Promise<UserInterface | null>
   saveUser(newDetails: ISaveUser): Promise<UserInterface | null> 
}

