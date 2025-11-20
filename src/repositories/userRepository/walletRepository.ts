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
}

export default WalletRepository;
