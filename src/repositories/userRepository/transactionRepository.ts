import type { ClientSession } from "mongoose";
import type { TransactionInterface } from "../../interfaces/models/ITransaction";
import type { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import transactionModel from "../../models/transactionModel";
import { BaseRepository } from "../baseRepository/baseRepository";
import mongoose from "mongoose";

class TransactionRepository
  extends BaseRepository<TransactionInterface>
  implements ITransactionRepository
{
  constructor() {
    super(transactionModel);
  }

  async createTransaction(
    payload: Partial<TransactionInterface>,
    session?: ClientSession
  ): Promise<TransactionInterface | null> {
    // Ensure transactionId exists before saving (caller should provide or generate)
    if (!payload.transactionId) {
      throw new Error("transactionId is required");
    }
    return this.save(payload as Partial<TransactionInterface>, session);
  }

  async findByTransactionId(
    transactionId: string,
    session?: ClientSession
  ): Promise<TransactionInterface | null> {
    return this.findOne({ transactionId } as any, session);
  }

  //   async findByIdempotencyKey(idempotencyKey: string, session?: ClientSession) {
  //     return this.findOne({ idempotencyKey } as any, session);
  //   }

  async getHistory(userId:string):Promise<TransactionInterface [] | null>{
    try{
        const newUserId = new mongoose.Types.ObjectId(userId);
        const filter = {userId:newUserId};
        const transactions = await this.find(filter)
        console.log("transactions are ",transactions);
        return transactions
    }catch(error){
        console.log("error occured in getHistory in transactionRepo",error);
        throw error
    }
  }
}

export default TransactionRepository;
