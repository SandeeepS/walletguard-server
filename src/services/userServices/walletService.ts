import mongoose from "mongoose";
import type { TransactionInterface } from "../../interfaces/models/ITransaction";
import type { IWalletService } from "../../interfaces/services/IWalletService";
import { v4 as uuidv4 } from "uuid";
import type { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import type { IWalletRepository } from "../../interfaces/repositories/IWalletRepository";
import type { WalletInterface } from "../../interfaces/models/IWallet";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";


// this serviec layer is for wallet operations
class WalletService implements IWalletService {
  constructor(
    private _transactionRepository: ITransactionRepository,
    private _walletRepository: IWalletRepository,
    private _userRepository: IUserRepository
  ) {
    this._transactionRepository = _transactionRepository;
    this._walletRepository = _walletRepository;
    this._userRepository = _userRepository;
  }

  async deposit(
    userId: string,
    amountPaise: number
  ): Promise<TransactionInterface> {
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      throw new Error("Amount must be a positive number (in paise).");
    }
    const transactionId = uuidv4();
    const session = await mongoose.startSession();
    try {
      let createdTransaction: TransactionInterface | null = null;
      await session.withTransaction(
        async () => {
          const existing =
            await this._transactionRepository.findByTransactionId(
              transactionId,
              session
            );
          if (existing) {
            throw new Error("Transaction already processed");
          }

          const walletBefore = await this._walletRepository.findByUserId(
            userId,
            session
          );
          if (!walletBefore) throw new Error("Wallet not found");

          const balanceBefore = walletBefore.balance;
          const updatedWallet = await this._walletRepository.incrementBalance(
            userId,
            amountPaise,
            session
          );
          if (!updatedWallet) throw new Error("Failed to update wallet");

          const balanceAfter = updatedWallet.balance;

          const transactionPayload: Partial<TransactionInterface> = {
            transactionId,
            userId: (walletBefore.userId as any).toString(),
            walletId: (updatedWallet._id as any).toString(),
            type: "DEPOSIT",
            amount: amountPaise,
            balanceBefore,
            balanceAfter,
            status: "SUCCESS",
          };

          createdTransaction =
            await this._transactionRepository.createTransaction(
              transactionPayload,
              session
            );
        },
        {
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        }
      );

      if (!createdTransaction)
        throw new Error("Deposit transaction failed unexpectedly");
      return createdTransaction;
    } catch (err: any) {
      if (err.code === 11000 || err) {
        const existing = await this._transactionRepository.findByTransactionId(
          transactionId
        );
        if (existing) return existing;
      }
      throw err;
    } finally {
      session.endSession();
    }
  }

  async withdraw(
    userId: string,
    amount: number
  ): Promise<WalletInterface | null> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid withdrawal amount");
    }
    const session = await mongoose.startSession();

    try {
      let transaction = null;

      await session.withTransaction(async () => {
        const user = await this._userRepository.getUserDetails(userId, session);
        if (!user) {
          throw new Error("user not found");
        }
        const walletId = user.walletId.toString();
        const wallet = await this._walletRepository.getWalletDetails(
          walletId,
          session
        );
        console.log("wallet Details got is", wallet);
        if (!wallet) throw new Error("Wallet not found");
        const before = wallet.balance;
        const amountPaise = amount * 100;
        const updated = await this._walletRepository.decrementBalance(
          userId,
          amountPaise,
          session
        );
        if (!updated) throw new Error("Insufficient balance");

        const after = updated.balance;
        const transactionId = uuidv4();

        const newUserId = new mongoose.Types.ObjectId(userId);
        transaction = await this._transactionRepository.createTransaction(
          {
            transactionId,
            userId: newUserId,
            walletId: updated._id,
            type: "WITHDRAW",
            amount: amountPaise,
            balanceBefore: before,
            balanceAfter: after,
            status: "SUCCESS",
          },
          session
        );
      });

      return transaction;
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }

  //for getting the balace amount 
  async getBalance(
    userId: string
  ): Promise<{ balance: number; currency: string } | null> {
    const wallet = await this._walletRepository.findByUserId(userId);
    console.log("wallet amount result is ", wallet);
    if (!wallet) return null;
    const balanceInRupees = wallet.balance / 100;
    return { balance: balanceInRupees, currency: wallet.currency };
  }


  //for gettin the transaction history of the user 
  async getTransactionHistory(
    userId: string
  ): Promise<TransactionInterface[] | null> {
    const result = await this._transactionRepository.getHistory(userId);
    return result;
  }
}

export default WalletService;
