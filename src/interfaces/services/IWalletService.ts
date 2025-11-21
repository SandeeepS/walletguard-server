import type { TransactionInterface } from "../models/ITransaction";
import type { WalletInterface } from "../models/IWallet";

export interface IWalletService {
     deposit(userId: string,amountPaise: number): Promise<TransactionInterface>
     withdraw(userId: string,amountPaise: number): Promise<WalletInterface | null>
     getBalance(userId: string): Promise<{ balance: number; currency: string } | null>
     getTransactionHistory(userId: string): Promise<TransactionInterface[] | null>
}