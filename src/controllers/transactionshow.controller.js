const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");

async function getUserTransactions(req, res) {
    try {
        const account = await accountModel.findOne({ user: req.user._id });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const transactions = await transactionModel
            .find({
                $or: [
                    { fromAccount: account._id },
                    { toAccount: account._id }
                ]
            })
            .populate({
                path: "fromAccount",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .populate({
                path: "toAccount",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .sort({ createdAt: -1 });

        const formattedTransactions = transactions.map(t => ({
            _id: t._id,
            amount: t.amount,
            description: t.description,
            createdAt: t.createdAt,

            fromAccountNumber: t.fromAccount?.number,
            toAccountNumber: t.toAccount?.number,

            fromAccountName: t.fromAccount?.user?.name,
            toAccountName: t.toAccount?.user?.name
        }));

        res.status(200).json({
            transactions: formattedTransactions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getUserTransactions
};