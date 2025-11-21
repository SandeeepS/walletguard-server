import express, { Router, type NextFunction, type Request, type Response } from "express";
import UserRepository from "../repositories/userRepository/userRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateTokens";
import WalletRepository from "../repositories/userRepository/walletRepository";
import AuthController from "../controllers/userController/authController";
import AuthService from "../services/userServices/authService";
import WalletController from "../controllers/userController/walletController";
import WalletService from "../services/userServices/walletService";
import TransactionRepository from "../repositories/userRepository/transactionRepository";
import userAuth from "../middlewares/userAuth";

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const transactionRepository = new TransactionRepository();

const createJWT = new CreateJWT();
const encrypt = new Encrypt();
const authService = new AuthService(userRepository,walletRepository,createJWT,encrypt);
const walletService = new WalletService(transactionRepository,walletRepository,userRepository);
const walletController = new WalletController(walletService);
const authController = new AuthController(authService);

//public routes 
userRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await authController.signup(req,res,next));
userRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await authController.login(req,res,next));
userRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => await authController.logout(req, res,next));

//protected route , using userAuth for authentication
userRouter.post('/deposit',userAuth, async(req:Request,res:Response,next:NextFunction) => await walletController.deposit(req,res,next));
userRouter.post('/withdraw',userAuth,async(req:Request,res:Response,next:NextFunction) => await walletController.withdraw(req,res,next));
userRouter.get('/balance',userAuth,async(req:Request,res:Response,next:NextFunction) => await walletController.balance(req,res,next));
userRouter.get('/history',userAuth,async(req:Request,res:Response,next:NextFunction) => await walletController.getTransactionHistory(req,res,next));

export default userRouter;
