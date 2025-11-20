import express, { Router, type NextFunction, type Request, type Response } from "express";
import UserAuthController from "../controllers/userController/userAuthController";
import UserAuthService from "../services/userServices/userAuthService";
import UserRepository from "../repositories/userRepository/userRepository";
import UserService from "../services/userServices/userService";
import UserController from "../controllers/userController/userController";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateTokens";
import WalletRepository from "../repositories/userRepository/walletRepository";

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const createJWT = new CreateJWT();
const encrypt = new Encrypt();
const userAuthService = new UserAuthService(userRepository,walletRepository,createJWT,encrypt);
const userService = new UserService(); 
const controller = new UserController();
const authController = new UserAuthController(userAuthService,userService);

userRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await authController.signup(req,res,next));
userRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await authController.login(req,res,next));



export default userRouter;
