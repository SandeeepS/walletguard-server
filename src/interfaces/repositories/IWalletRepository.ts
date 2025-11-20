import type { ClientSession } from "mongoose";
import type { WalletInterface } from "../models/IWallet";

export interface IWalletRepository{
    createWallet(payload: Partial<WalletInterface>,session?: ClientSession): Promise<WalletInterface | null>
}