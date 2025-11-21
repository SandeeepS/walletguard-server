import type { ClientSession } from "mongoose";
import type { TransactionInterface } from "../models/ITransaction";

export interface ITransactionRepository{
    findByTransactionId(transactionId: string, session?: ClientSession): Promise<TransactionInterface | null>
    createTransaction(payload: Partial<TransactionInterface>,session?: ClientSession): Promise<TransactionInterface | null> 
    getHistory(userId:string):Promise<TransactionInterface [] | null>
}