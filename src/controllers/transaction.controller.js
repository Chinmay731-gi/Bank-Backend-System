const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
    const { fromAccountNumber, toAccountNumber, amount, idempotencyKey } = req.body;

    if (!fromAccountNumber || !toAccountNumber || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "From Account, To Account, Amount and Idempotency Key are required"
        });
    }

    const session = await mongoose.startSession();

    try {
        let finalTransaction;

        await session.withTransaction(async () => {
            const existingTransaction = await transactionModel.findOne({ idempotencyKey }).session(session);

            if (existingTransaction) {
                finalTransaction = existingTransaction;
                return; 
            }

            const fromUserAccount = await accountModel.findOne({ number: fromAccountNumber }).session(session);
            const toUserAccount = await accountModel.findOne({ number: toAccountNumber }).session(session);

            if (!fromUserAccount || !toUserAccount) {
                throw new Error("Invalid Account Number");
            }

            if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
                throw new Error("Both accounts must be ACTIVE");
            }

            const balance = await fromUserAccount.getBalance(session);

            if (balance < amount) {
                throw new Error(`Insufficient balance. Current balance is ${balance}`);
            }

            const [transaction] = await transactionModel.create([{
                fromAccount: fromUserAccount._id,
                toAccount: toUserAccount._id,
                amount,
                idempotencyKey,
                status: "COMPLETED"
            }], { session });

            await ledgerModel.create([
                {
                    account: fromUserAccount._id,
                    amount: -amount,
                    transaction: transaction._id,
                    type: "DEBIT"
                },
                {
                    account: toUserAccount._id,
                    amount: amount,
                    transaction: transaction._id,
                    type: "CREDIT"
                }
            ], { session });

            finalTransaction = transaction;
        });

        res.status(201).json({
            message: "Transaction completed successfully",
            transaction: finalTransaction
        });

        emailService
            .sendTransactionEmail(
                req.user.email,
                req.user.name,
                amount,
                toAccountNumber
            )
            .catch(err => console.error("Email background error:", err));

    } catch (error) {
        console.error("Transaction failed:", error);
        return res.status(400).json({
            message: error.message || "Transaction failed. Please try again."
        });
    } finally {
        await session.endSession();
    }
}

module.exports = { createTransaction };