import mongoose from "mongoose";
import type { TransactionInterface } from "../../interfaces/models/ITransaction";
import type { IWalletService } from "../../interfaces/services/IWalletService";
import { v4 as uuidv4 } from "uuid";
import type { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import type { IWalletRepository } from "../../interfaces/repositories/IWalletRepository";
import type { WalletInterface } from "../../interfaces/models/IWallet";

class WalletService implements IWalletService {
  constructor(
    private _transactionRepository: ITransactionRepository,
    private _walletRepository: IWalletRepository
  ) {
    this._transactionRepository = _transactionRepository;
    this._walletRepository = _walletRepository;
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
      let createdTx: TransactionInterface | null = null;

      await session.withTransaction(
        async () => {
          // idempotency: if transaction with same transactionId already exists, throw IdempotencyError
          const existing =
            await this._transactionRepository.findByTransactionId(
              transactionId,
              session
            );
          if (existing) {
            // return existing transaction after transaction finishes (abort)
            throw new Error("Transaction already processed");
          }

          // get wallet (must exist)
          const walletBefore = await this._walletRepository.findByUserId(
            userId,
            session
          );
          if (!walletBefore) throw new Error("Wallet not found");

          const balanceBefore = walletBefore.balance;

          // increment balance atomically
          const updatedWallet = await this._walletRepository.incrementBalance(
            userId,
            amountPaise,
            session
          );
          if (!updatedWallet) throw new Error("Failed to update wallet");

          const balanceAfter = updatedWallet.balance;

          // create transaction record in same session
          const txPayload: Partial<TransactionInterface> = {
            transactionId,
            userId: (walletBefore.userId as any).toString(),
            walletId: (updatedWallet._id as any).toString(),
            type: "DEPOSIT",
            amount: amountPaise,
            balanceBefore,
            balanceAfter,
            status: "SUCCESS",
          };

          createdTx = await this._transactionRepository.createTransaction(
            txPayload,
            session
          );
        },
        {
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        }
      );

      // if committed, createdTx should be set
      if (!createdTx)
        throw new Error("Deposit transaction failed unexpectedly");
      return createdTx;
    } catch (err: any) {
      // handle duplicate-key (someone else created transaction) as idempotent success
      if (err.code === 11000 || err) {
        // find and return existing tx
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
    amountPaise: number
  ): Promise<WalletInterface | null> {
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    const session = await mongoose.startSession();

    try {
      let transaction = null;

      await session.withTransaction(async () => {
        const wallet = await this._walletRepository.findByUserId(
          userId,
          session
        );
        if (!wallet) throw new Error("Wallet not found");

        const before = wallet.balance;

        const updated = await this._walletRepository.decrementBalance(
          userId,
          amountPaise,
          session
        );

        if (!updated) throw new Error("Insufficient balance");

        const after = updated.balance;
        const newUserId = new mongoose.Types.ObjectId(userId);
        transaction = await this._transactionRepository.createTransaction(
          {
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

  async getBalance(
    userId: string
  ): Promise<{ balance: number; currency: string } | null> {
    const wallet = await this._walletRepository.findByUserId(userId);

      console.log("wallet amount result is ",wallet);
    if (!wallet) return null;
    const balanceInRupees = wallet.balance / 100;

    return { balance: balanceInRupees, currency: wallet.currency };
  }
}

export default WalletService;
