const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require("express-session");
const flash = require("connect-flash");

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');
const pageRouter = require('./routes/page.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave:false, saveUninitialized:true }));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use("/api", pageRouter);

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);

module.exports = app;
