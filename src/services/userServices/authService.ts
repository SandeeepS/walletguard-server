import Cryptr from "cryptr";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import type {
  INewDetails,
  ISingUp,
  IUserLogin,
  IUserLoginResponse,
  IUserSingupResponse,
} from "../../interfaces/dataContracts/user/services/IService.dto";
import type { UserInterface } from "../../interfaces/models/IUser";
import { LoginValidation, SignUpValidation } from "../../utils/validator";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import type { IEncrypt } from "../../utils/comparePassword";
import type { ICreateJWT } from "../../utils/generateTokens";
import mongoose from "mongoose";
import type { IWalletRepository } from "../../interfaces/repositories/IWalletRepository";
import type { IAuthService } from "../../interfaces/services/IAuthService";

class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _walletRepository: IWalletRepository,
    private _createJWT: ICreateJWT,
    private _encrypt: IEncrypt
  ) {
    this._userRepository = _userRepository;
    this._walletRepository = _walletRepository;
    this._createJWT = _createJWT;
    this._encrypt = _encrypt;
  }

  async signup(userData: ISingUp): Promise<IUserSingupResponse | null> {
    const session = await mongoose.startSession();
    let createdUser: UserInterface | null = null;

    try {
      await session.withTransaction(
        async () => {
          const { email, name, phoneNumber, password, confirmPassword } =
            userData;
          const isValid = SignUpValidation(
            name,
            phoneNumber.toString(),
            email,
            password,
            confirmPassword
          );

          if (!isValid) {
            throw new Error("Invalid user data");
          }

          const userExists = await this._userRepository.emailExistCheck(
            { email },
            session
          );
          if (userExists) {
            throw new Error("Email already exists");
          }

          const secret_key: string | undefined = process.env.CRYPTR_SECRET_KEY;
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
            phoneNumber: phoneNumber,
          };

          const user = await this._userRepository.saveUser(newDetails, session);
          if (!user) {
            throw new Error("Failed to create user");
          }
          createdUser = user;

          await this._walletRepository.createWallet(
            {
              userId: user._id,
              balance: 0, // paise
              currency: "INR",
            },
            session
          );
        },
        {
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        }
      );

      if (!createdUser) {
        throw new Error("User creation ended without result");
      }

      const userResult = createdUser as UserInterface;
      const id = userResult._id.toString();
      const access_token = this._createJWT.generateAccessToken(
        id,
        userResult.role
      );
      const refresh_token = this._createJWT.generateRefreshToken(id);

      return {
        success: true,
        message: "user signup successful",
        data: userResult,
        access_token,
        refresh_token,
      };
    } catch (err: any) {
      console.error("Error in signup in the userAuthService", err);
      throw err;
    } finally {
      session.endSession();
    }
  }
  async login(data: IUserLogin): Promise<IUserLoginResponse | null> {
    try {
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const user = await this._userRepository.emailExistCheck({ email });
        console.log(
          "accessed user details from the userAuthService, in the login function is ",
          user
        );
        if (user?._id) {
          if (user.isBlocked) {
            console.log("User is blocked");
            return {
              success: false,
              message: "Your account has been blocked by the admin",
            } as const;
          } else {
            if (user.password && password) {
              const passwordMatch = await this._encrypt.compare(
                password,
                user.password as string
              );

              if (passwordMatch) {
                const userId = user._id.toString();
                const token = this._createJWT.generateAccessToken(
                  userId,
                  user.role
                );
                const refreshToken =
                  this._createJWT.generateRefreshToken(userId);
                console.log("user is exist", user);

                const filteredUser = {
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };

                return {
                  success: true,
                  message: "Authentication Successful !",
                  data: filteredUser,
                  token: token,
                  refresh_token: refreshToken,
                };
              } else {
                console.log("Incorrect password");
                return {
                  success: false,
                  message: "Incorrted password",
                } as const;
              }
            } else {
              console.log("Email or password is missing");
              return {
                success: false,
                message: "Email or password is missing",
              } as const;
            }
          }
        } else {
          return {
            success: false,
            message: "Email not exist",
          } as const;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        "Error occurred in the userLogin in the userAuthService",
        error
      );
      throw error;
    }
  }
}
export default AuthService;
