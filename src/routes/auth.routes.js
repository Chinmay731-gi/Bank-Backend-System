const express = require('express');
const {userRegisterController,userLoginController, userLogoutController} = require('../controllers/auth.controller')
const router = express.Router();

router.post('/register',userRegisterController);

router.post('/login',userLoginController);

router.post('/logout',userLogoutController);

module.exports = router;

