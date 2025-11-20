import type { ClientSession } from "mongoose";
import type { TransactionInterface } from "../../interfaces/models/ITransaction";
import type { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import transactionModel from "../../models/transactionModel";
import { BaseRepository } from "../baseRepository/baseRepository";

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
}

export default TransactionRepository;
