const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

async function createTransaction(req, res) {

    const { fromAccountNumber, toAccountNumber, amount, idempotencyKey } = req.body

    if (!fromAccountNumber || !toAccountNumber || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccountNumber, toAccountNumber, amount, and idempotencyKey are required"
        })
    }

    const [fromUserAccount, toUserAccount] = await Promise.all([
        accountModel.findOne({ number: fromAccountNumber }),
        accountModel.findOne({ number: toAccountNumber }),
    ])

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid account number(s)"
        })
    }

    const fromAccount = fromUserAccount._id
    const toAccount = toUserAccount._id

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both from Account and To Account must be ACTIVE to process transaction"
        })
    }

    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    let transaction;
    try {
        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        await Promise.all([
            ledgerModel.create([{
                account: fromAccount,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session }),
            ledgerModel.create([{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session })
        ])

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction() 
        session.endSession()
        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })
    }

    emailService
        .sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccountNumber
        )
        .catch(err => console.error("Email error", err))

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction,
    })
}

async function createInitialFundsTransaction(req, res) {
    const { toAccountNumber, amount, idempotencyKey } = req.body;

    if (!toAccountNumber || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [toUserAccount, systemAccount] = await Promise.all([
            accountModel.findOne({ number: toAccountNumber }).session(session),
            accountModel.findOne({ systemAccount: true }).session(session),
        ])

        if (!toUserAccount) throw new Error("Invalid toAccountNumber");
        if (!systemAccount) throw new Error("System account missing");

        const transaction = (await transactionModel.create([{
            fromAccount: systemAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0];

        await Promise.all([
            ledgerModel.create([{
                account: systemAccount._id,
                amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session }),
            ledgerModel.create([{
                account: toUserAccount._id,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session })
        ])

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "Funds added", transaction });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}