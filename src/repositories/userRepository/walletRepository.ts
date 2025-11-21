import type { ClientSession } from "mongoose";
import type { WalletInterface } from "../../interfaces/models/IWallet";
import type { IWalletRepository } from "../../interfaces/repositories/IWalletRepository";
import walletModel from "../../models/walletModel";
import { BaseRepository } from "../baseRepository/baseRepository";
import mongoose from "mongoose";

//repository layer for wallet database operations 
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
    return this.findOne({ userId: userId } as any, session);
  }

  async getWalletDetails(
    walletId: string,
    session?: ClientSession
  ): Promise<WalletInterface | null> {
    const newWalletId = new mongoose.Types.ObjectId(walletId);
    return await this.findOne({ _id: newWalletId }, session);
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
    const filter = { userId: userId, balance: { $gte: amount } } as any;
    const update = { $inc: { balance: -amount } };
    return await this.findOneAndUpdate(filter, update, session);
  }
}

export default WalletRepository;
