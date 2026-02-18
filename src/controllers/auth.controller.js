const userModel = require('../models/user.model');
const accountModel = require('../models/account.model'); 
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require('../models/blackList.model');

async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await userModel.findOne({ email });
        if (isExists) {
            return res.status(422).json({
                message: "Email already exists",
                status: "Failed"
            });
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

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            account,
            token
        });

        await emailService.sendRegistrationEmail(user.email, user.name);

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            message: "Internal server error",
            status: "Failed"
        });
    }
}

async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Email or password is invalid" });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Email or password is invalid" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); 

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal server error",
            status: "Failed"
        });
    }
}

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(400).json({
            message : "User Logout Successfuly"
        })
    }

    res.cookie('token', "")

    await tokenBlacklistModel.create({
        token:token
    })

    res.status(200).json({
        message: "User logout sucessfully"
    })
}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};
