import type { ClientSession, ObjectId } from "mongoose";
import type {
  IEmailExistCheck,
  IGetUserDetails,
  ISaveUser,
} from "../../interfaces/dataContracts/user/reporitory/IRepository.dto";
import type { UserInterface } from "../../interfaces/models/IUser";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import userModel from "../../models/userModel";
import { BaseRepository } from "../baseRepository/baseRepository";
import type { promises } from "dns";

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

  async emailExistCheck(
    data: IEmailExistCheck,
    session?: ClientSession
  ): Promise<UserInterface | null> {
    const { email } = data;
    console.log("email find in userRepsoi", email);
    return this.findOne({ email: email }, session);
  }

  async setWalletId(
    userId: string,
    walletId: string,
    session?: ClientSession
  ): Promise<UserInterface | null> {
    return this.findByIdAndUpdate(
      userId,
      { $set: { walletId: walletId } },
      session
    );
  }

  async getUserDetails(
    userId:string,
    session?: ClientSession
  ): Promise<UserInterface | null> {
    try {
      const result = await this.findById(userId, session);
      return result;
    } catch (error) {
      console.log(
        "error occured while fechting the user details in the userRepositroy",
        error
      );
      throw error;
    }
  }
}

export default UserRepository;
