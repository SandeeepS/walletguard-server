import express, { Router, type NextFunction, type Request, type Response } from "express";
import UserRepository from "../repositories/userRepository/userRepository";
import UserService from "../services/userServices/userService";
import UserController from "../controllers/userController/controller";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateTokens";
import WalletRepository from "../repositories/userRepository/walletRepository";
import AuthController from "../controllers/userController/authController";
import AuthService from "../services/userServices/authService";
import WalletController from "../controllers/userController/walletController";
import WalletService from "../services/userServices/walletService";
import TransactionRepository from "../repositories/userRepository/transactionRepository";

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const transactionRepository = new TransactionRepository();

const createJWT = new CreateJWT();
const encrypt = new Encrypt();
const authService = new AuthService(userRepository,walletRepository,createJWT,encrypt);
const userService = new UserService(); 
const walletService = new WalletService(transactionRepository,walletRepository,userRepository);
const controller = new UserController();
const walletController = new WalletController(walletService);
const authController = new AuthController(authService,userService);


userRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await authController.signup(req,res,next));
userRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await authController.login(req,res,next));

userRouter.post('/deposit',async(req:Request,res:Response,next:NextFunction) => await walletController.deposit(req,res,next));
userRouter.post('/withdraw',async(req:Request,res:Response,next:NextFunction) => await walletController.withdraw(req,res,next));
userRouter.get('/balance',async(req:Request,res:Response,next:NextFunction) => await walletController.balance(req,res,next));
userRouter.get('/history',async(req:Request,res:Response,next:NextFunction) => await walletController.getTransactionHistory(req,res,next));

export default userRouter;
