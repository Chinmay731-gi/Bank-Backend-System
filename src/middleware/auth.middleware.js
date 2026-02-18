const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blackList.model');


async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token) {return res.status(401).json({
        message: "Unauthorized acces, token is missing"
    })
   }

   const isTokenBlacklisted = await tokenBlacklistModel.findOne({token})

   if(isTokenBlacklisted) {
    return res.status(400).json({
        message: "Unauthorized acces, token is inValid"
    })
   }

   try{
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
     const user = await userModel.findById(decoded.userId)
     req.user = user
     return next()
   }catch(err){
    return res.status(401).json({
        message: "Unauthorized acces, token is missing"
    })
   }

}

async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token) {return res.status(401).json({
        message: "Unauthorized acces, token is missing"
    })
   }
   
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({token})

   if(isTokenBlacklisted) {
    return res.status(400).json({
        message: "Unauthorized acces, token is inValid"
    })
   }

   try{
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
     const user = await userModel.findById(decoded.userId).select('+systemUser')
     if(!user.systemUser){
        return res.status(403).json({
            message: "You are forbidden to use this"
        })
     }
     req.user = user
     return next()
   }catch(err){
    return res.status(401).json({
        message: "Unauthorized acces, token is missing"
    })
   }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}