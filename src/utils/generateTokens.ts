import type { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
dotenv.config();

interface VerifyResult {
  success: boolean;
  decoded?: JwtPayload;
  message: string;
}

export interface ICreateJWT {
  generateToken(id:string): string;
  verifyToken(token: string): VerifyResult;
}

export class CreateJWT implements ICreateJWT {
  generateToken(id: string): string {
    if (!id) {
      throw new Error("id is required for token generation");
    }
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET as Secret, {
      expiresIn: "1h",
    });
    return token;
  }

  verifyToken(token: string): VerifyResult {
    try {
      const secret = process.env.JWT_SECRET as Secret;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { success: true, decoded, message: "verified" };
    } catch (error) {
      console.error("Error while verifying access JWT token:", error);
      return { success: false, message: "Access Token Expired!" };
    }
  }
}
