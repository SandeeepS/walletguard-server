import type { ISingUp, IUserLogin } from "../dataContracts/user/services/IService.dto";
import type { UserInterface } from "../models/IUser";

export interface IUserAuthService {
    signup(userData: ISingUp): Promise<UserInterface | null>
     login(data: IUserLogin): Promise<UserInterface | null>
}