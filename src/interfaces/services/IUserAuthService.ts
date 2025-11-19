import type { ISingUp } from "../dataContracts/user/services/IService.dto";
import type { UserInterface } from "../models/IUser";

export interface IUserAuthService {
    userRegister(userData: ISingUp): Promise<UserInterface | null>
}