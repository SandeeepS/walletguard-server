import type { IEmailExistCheck, ISaveUser } from "../../interfaces/dataContracts/user/reporitory/IRepository.dto";
import type { UserInterface } from "../../interfaces/models/IUser";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import userModel from "../../models/userModel";
import { BaseRepository } from "../baseRepository/baseRepository";

class UserRepository extends BaseRepository<UserInterface > implements IUserRepository  {
  constructor() {
    super(userModel);
    
  }


    async saveUser(newDetails: ISaveUser): Promise<UserInterface | null> {
    return this.save(newDetails);
  }

    async emailExistCheck(
    data: IEmailExistCheck
  ): Promise<UserInterface | null> {
    const { email } = data;
    console.log("email find in userRepsoi", email);
    return this.findOne({ email: email }) ;
  }
}

export default UserRepository;
