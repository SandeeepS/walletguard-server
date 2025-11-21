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

  async getHistory(userId: string): Promise<TransactionInterface[] | null> {
    const newUserId = new mongoose.Types.ObjectId(userId);
    const filter = { userId: newUserId };
    return await this.find(filter);
  }
}

export default TransactionRepository;
