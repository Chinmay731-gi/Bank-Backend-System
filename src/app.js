const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require("express-session");
const flash = require("connect-flash");

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');
const pageRouter = require('./routes/page.routes');
const { authMiddleware } = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave:false, saveUninitialized:true }));
app.use(flash());

app.use((req,res,next) => {
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const jwt = require("jsonwebtoken");
      const userModel = require("./models/user.model");
      const tokenBlacklistModel = require('./models/blackList.model');
      
      const isTokenBlacklisted = await tokenBlacklistModel.findOne({token});
      
      if (!isTokenBlacklisted) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);
        req.user = user;
        res.locals.user = user;
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }
  } catch (err) {
    res.locals.user = null;
  }
  next(); 
});

app.use("/api/auth", authRouter);
app.use("/api", pageRouter);

app.use("/api/account", authMiddleware, accountRouter);
app.use("/api/transaction", authMiddleware, transactionRouter);

module.exports = app;