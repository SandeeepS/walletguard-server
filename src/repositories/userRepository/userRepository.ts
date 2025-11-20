import type { ClientSession } from "mongoose";
import type {
  IEmailExistCheck,
  ISaveUser,
} from "../../interfaces/dataContracts/user/reporitory/IRepository.dto";
import type { UserInterface } from "../../interfaces/models/IUser";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import userModel from "../../models/userModel";
import { BaseRepository } from "../baseRepository/baseRepository";

class UserRepository
  extends BaseRepository<UserInterface>
  implements IUserRepository
{
  constructor() {
    super(userModel);
  }

  async saveUser(
    newDetails: ISaveUser,
    session?: ClientSession
  ): Promise<UserInterface | null> {
    return this.save(newDetails as any, session);
  }

  async emailExistCheck(data: IEmailExistCheck,session?:ClientSession): Promise<UserInterface | null> {
    const { email } = data;
    console.log("email find in userRepsoi", email);
    return this.findOne({ email: email },session);
  }
}

export default UserRepository;
