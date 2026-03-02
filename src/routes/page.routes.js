const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const accountModel = require('../models/account.model');
const { getUserTransactions } = require("../controllers/transactionshow.controller");
const transactionModel = require("../models/transaction.model");

router.get("/home", (req, res) => res.render("home"));
router.get("/homels", authMiddleware, async (req, res) => {
    try {
        const accounts = await accountModel.find({ user: req.user._id });
        
        let transactions = [];
        if (accounts.length > 0) {
            transactions = await transactionModel
                .find({
                    $or: [
                        { fromAccount: accounts[0]._id },
                        { toAccount: accounts[0]._id }
                    ]
                })
                .sort({ createdAt: -1 });
        }
        
        res.render("homels", { 
            user: req.user, 
            accounts,
            transactions: transactions 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
router.get("/auth/login", (req, res) => res.render("login", { error: req.query.error }));
router.get("/auth/register", (req, res) => res.render("signup", { error: req.query.error }));
router.get("/auth/logout", (req, res) => { res.clearCookie("token"); res.redirect("/api/home")});

router.get("/transactions/:accountId", authMiddleware, getUserTransactions);

module.exports = router;
