const express = require("express");
const router = express.Router();
const {userHomePage } = require("../controllers/home.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const accountModel = require('../models/account.model');

router.get("/home", (req, res) => res.render("home"));
router.get("/homels",authMiddleware, async (req, res) => {
   const accounts = await accountModel.find({user: req.user._id});
    res.render("homels", {accounts});
});
router.get("/auth/login", (req, res) => res.render("login", { error: req.query.error }));
router.get("/auth/register", (req, res) => res.render("signup", { error: req.query.error }));


module.exports = router;
