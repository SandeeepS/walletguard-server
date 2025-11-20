import type { ClientSession } from "mongoose";
import type { WalletInterface } from "../models/IWallet";

export interface IWalletRepository{
    createWallet(payload: Partial<WalletInterface>,session?: ClientSession): Promise<WalletInterface | null>
    findByUserId(userId: string,session?: ClientSession): Promise<WalletInterface | null>
    incrementBalance(userId: string,amount: number,session?: ClientSession): Promise<WalletInterface | null> 
    decrementBalance(userId: string,amount: number,session?: ClientSession): Promise<WalletInterface | null>
}