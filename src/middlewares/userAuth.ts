import type { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";
import { CreateJWT } from "../utils/generateTokens";
import type { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

dotenv.config();

const jwt = new CreateJWT();

export const userAuth: RequestHandler = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.token as string | undefined;
    if (!tokenFromCookie) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Please log in again. (no token cookie)",
      });
    }

    const token = tokenFromCookie.startsWith("Bearer ")
      ? tokenFromCookie.split(" ")[1]
      : tokenFromCookie;

    const verified = await Promise.resolve(jwt.verifyToken(token as string));
    if (!verified) {
      clearAuthCookies(res);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = verified;
    return next();
  } catch (error) {
    console.error("Token verification failed:", error);
    clearAuthCookies(res);
    return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
  }
};

export default userAuth;

const clearAuthCookies = (res: Response) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
};
