import type { Request, Response, NextFunction } from "express";
import type { IUserAuthController } from "../../interfaces/controllers/IUserAuthController";
import type { IUserAuthService } from "../../interfaces/services/IUserAuthService";
import type { IUserService } from "../../interfaces/services/IUserService";

class UserAuthController implements IUserAuthController {
  constructor(
    private _userAuthService: IUserAuthService,
    private _userServices: IUserService
  ) {}

  async userSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;
      console.log("userDetails from the frontend is.", userData);

      const result = await this._userAuthService.userRegister(userData);
      console.log("result of the newely registered user is ",result);
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
}

export default UserAuthController;
