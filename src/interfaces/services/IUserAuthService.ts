import type { ISingUp, IUserLogin, IUserLoginResponse, IUserSingupResponse } from "../dataContracts/user/services/IService.dto";
import type { UserInterface } from "../models/IUser";

export interface IUserAuthService {
    signup(userData: ISingUp): Promise<IUserSingupResponse | null>
     login(data: IUserLogin): Promise<IUserLoginResponse | null>
}