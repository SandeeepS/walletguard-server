import type { Request, Response, NextFunction } from "express";
import type { IUserAuthController } from "../../interfaces/controllers/IUserAuthController";
import type { IUserAuthService } from "../../interfaces/services/IUserAuthService";
import type { IUserService } from "../../interfaces/services/IUserService";

class UserAuthController implements IUserAuthController {
  constructor(
    private _userAuthService: IUserAuthService,
    private _userServices: IUserService
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      console.log("userDetails from the frontend is.", userData);

      const result = await this._userAuthService.signup(userData);
      console.log("result of the newely registered user is ", result);
      res.status(201).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);

      const err = error as Error;
      if (err.message === "Invalid user data") {
        res.status(400).json({ success: false, message: "Invalid user data" });
      } else if (err.message === "Email already exists") {
        res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      } else if (err.message === "Failed to generate OTP") {
        res
          .status(500)
          .json({ success: false, message: "Failed to generate OTP" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
      next(error);
    }
  }



  
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const loginStatus = await this._userAuthService.login({
        email,
        password,
        role: "user",
      });

      console.log("user login status:", loginStatus);

    //   if (loginStatus.data.success === false) {
    //     res.status(OK).json({
    //       data: {
    //         success: false,
    //         message: loginStatus.data.message,
    //       },
    //     });
    //     return;
    //   } else {
    //     const access_token = loginStatus.data.token;
    //     const refresh_token = loginStatus.data.refresh_token;
    //     const accessTokenMaxAge = 5 * 60 * 1000; //5 min
    //     const refreshTokenMaxAge = 48 * 60 * 60 * 1000; //48 h
    //     console.log("response is going to send to the frontend");
    //     res
    //       .status(loginStatus.status)
    //       .cookie("user_access_token", access_token, {
    //         maxAge: accessTokenMaxAge,
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "none",
    //       })
    //       .cookie("user_refresh_token", refresh_token, {
    //         maxAge: refreshTokenMaxAge,
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "none",
    //       })
    //       .json(loginStatus);
    //   }
    if(loginStatus){
        return loginStatus
    }else{
        return null;
    }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

}

export default UserAuthController;
