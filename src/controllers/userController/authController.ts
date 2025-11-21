import type { Request, Response, NextFunction } from "express";
import type { IUserService } from "../../interfaces/services/IService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import type { IAuthController } from "../../interfaces/controllers/IAuthController";
import type { IAuthService } from "../../interfaces/services/IAuthService";

const { BAD_REQUEST, OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class AuthController implements IAuthController {
  constructor(
    private _userAuthService: IAuthService,
    private _userServices: IUserService
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      console.log("userDetails from the frontend is.", userData);

      const result = await this._userAuthService.signup(userData);
      console.log("result of the newly registered user is ", result);

      if (result && result.success) {
        const tokenMaxAge = 15 * 60 * 1000; // 15 minutes

        res
          .status(OK)
          .cookie("token", result.token, {
            maxAge: tokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({
            success: true,
            message: result.message || "User registered successfully",
            data: {
              userId: result.data?._id,
              user: result.data,
            },
          } as ApiResponse);
      } else {
        res.status(OK).json({
          success: false,
          message: result?.message || "Registration failed",
          data: null,
        } as ApiResponse);
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const loginStatus = await this._userAuthService.login({
        email,
        password,
        role: "user",
      });

      console.log("user login status:", loginStatus);

      if (!loginStatus || loginStatus.success === false) {
        res.status(OK).json({
          success: false,
          message: loginStatus?.message || "Login failed",
          data: null,
        } as ApiResponse);
        return;
      }

      const token = loginStatus.token;
      const tokenMaxAge = 5 * 60 * 1000; // 5 min

      console.log("response is going to send to the frontend");

      res
        .status(OK)
        .cookie("token", token, {
          maxAge: tokenMaxAge,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: loginStatus.message || "Login successful",
          data: loginStatus.data,
        } as ApiResponse);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Entered in the function for logout");

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(OK).json({
        success: true,
        message: "User logged out successfully",
        data: null,
      } as ApiResponse);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default AuthController;
