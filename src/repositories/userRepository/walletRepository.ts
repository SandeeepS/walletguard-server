import type { ClientSession } from "mongoose";
import type { WalletInterface } from "../../interfaces/models/IWallet";
import type { IWalletRepository } from "../../interfaces/repositories/IWalletRepository";
import walletModel from "../../models/walletModel";
import { BaseRepository } from "../baseRepository/baseRepository";

class WalletRepository
  extends BaseRepository<WalletInterface>
  implements IWalletRepository
{
  constructor() {
    super(walletModel);
  }
  async createWallet(
    payload: Partial<WalletInterface>,
    session?: ClientSession
  ): Promise<WalletInterface | null> {
    return this.save(payload as any, session);
  }

  async findByUserId(
    userId: string,
    session?: ClientSession
  ): Promise<WalletInterface | null> {
    console.log("userId in the findByUserId ind the walletRepository",userId);
    return this.findOne({ userId: userId } as any, session);
  }

  async incrementBalance(
    userId: string,
    amount: number,
    session?: ClientSession
  ): Promise<WalletInterface | null> {
    return this.findOneAndUpdate(
      { userId } as any,
      { $inc: { balance: amount } },
      session
    );
  }

  async decrementBalance(
    userId: string,
    amount: number,
    session?: ClientSession
  ): Promise<WalletInterface | null> {
    const filter = { userId, balance: { $gte: amount } } as any;
    const update = { $inc: { balance: -amount } };
    return this.findOneAndUpdate(filter, update, session);
  }
}

export default WalletRepository;
