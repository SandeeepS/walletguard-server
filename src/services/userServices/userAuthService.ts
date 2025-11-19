import Cryptr from "cryptr";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import type { IUserAuthService } from "../../interfaces/services/IUserAuthService";
import type {
  INewDetails,
  ISingUp,
} from "../../interfaces/dataContracts/user/services/IService.dto";
import type { UserInterface } from "../../interfaces/models/IUser";

class UserAuthService implements IUserAuthService {
  constructor(private _userRepository: IUserRepository) {}

  async userRegister(userData: ISingUp): Promise<UserInterface | null> {
    try {
      const { email, name, phone, password, cpassword } = userData;
      //   const isValid = SignUpValidation(
      //     name,
      //     phone.toString(),
      //     email,
      //     password,
      //     cpassword
      //   );

      //   if (!isValid) {
      //     throw new Error("Invalid user data");
      //   }

      const userExists = await this._userRepository.emailExistCheck({ email });
      if (userExists) {
        throw new Error("Email already exists");
      }

      const secret_key: string | undefined = process.env.CRYPTR_SECRET;
      if (!secret_key) {
        throw new Error(
          "Encryption secret key is not defined in the environment"
        );
      }

      const cryptr = new Cryptr(secret_key, {
        encoding: "base64",
        pbkdf2Iterations: 10000,
        saltLength: 10,
      });

      const newPassword = cryptr.encrypt(password as string);
      const newDetails: INewDetails = {
        name: name as string,
        password: newPassword as string,
        email: email as string,
        phone: phone,
      };

      const user = await this._userRepository.saveUser(newDetails);
    
      return user;

      //   const otp = await this._email.generateAndSendOTP(email);
      //   if (!otp) {
      //     throw new Error("Failed to generate OTP");
      //   }

      //   const tempUserDetails = { otp, userData };
      //   const savedTempUser = await this._userRepository.createTempUserData(
      //     tempUserDetails
      //   );

      //   return savedTempUser;
    } catch (error) {
      console.log("Error in userRegister in the userAuthService", error);
      throw error;
    }
  }
}
export default UserAuthService;
