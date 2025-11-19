import express, { Router, type NextFunction, type Request, type Response } from "express";
import UserAuthController from "../controllers/userController/userAuthController";
import UserAuthService from "../services/userServices/userAuthService";
import UserRepository from "../repositories/userRepository/userRepository";
import UserService from "../services/userServices/userService";
import UserController from "../controllers/userController/userController";

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const userAuthService = new UserAuthService(userRepository);
const userService = new UserService(); 
const controller = new UserController();
const authController = new UserAuthController(userAuthService,userService);

userRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await authController.userSignup(req,res,next));


export default userRouter;
