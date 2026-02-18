const userModel = require('../models/user.model');
const accountModel = require('../models/account.model'); 
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require('../models/blackList.model');

async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await userModel.findOne({ email});
        if (isExists) {
          req.flash("error", "User already exists");
          return res.redirect("/api/auth/login?error=User already exists. Please Login");
        }

        const user = await userModel.create({ email, name, password });

        const account = await accountModel.create({
            user: user._id,
            status: "ACTIVE",
            currency: "INR",
            balance: 0 
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); 

        res.status(201).redirect("/api/home")

        await emailService.sendRegistrationEmail(user.email, user.name);

    } catch (err) {
        req.flash("error", "Registration error");
        return res.redirect("/api/auth/login?error=Registration error, please try later");
    }
}

async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            req.flash("error", "User does not exists");
            return res.redirect("/api/auth/login?error=User does not exists. Please Signup");
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            req.flash("error", "User does not exists");
            return res.redirect("/api/auth/login?error=Password is incorrect.");
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); 

        res.status(200).redirect("/api/home")

    } catch (err) {
        req.flash("error", "Registration error");
        return res.redirect("/api/auth/login?error=Registration error, please try later");
    }
}

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        req.flash("error", "logout successfull");
        return res.redirect("/api/auth/login?error=Logout successful");
    }

    res.cookie('token', "")

    await tokenBlacklistModel.create({
        token:token
    })

    res.status(200).redirect("login")
}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};
