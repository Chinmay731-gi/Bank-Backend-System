const userModel = require('../models/user.model');
const accountModel = require('../models/account.model'); 

async function userHomePage(req, res) {
    try {

    if(!req.user) {
       return res
    }
    }
     catch (error) {
        return res.redirect("/api/auth/home")
    }
}

module.exports = {
    userHomePage
}