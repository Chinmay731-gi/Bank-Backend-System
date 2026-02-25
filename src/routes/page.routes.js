const express = require("express");
const router = express.Router();
const {userHomePage } = require("../controllers/home.controller");

router.get("/home", (req, res) => res.render("home"));
router.get("/homels",(req, res) => res.render("homels"));
router.get("/auth/login", (req, res) => res.render("login", { error: req.query.error }));
router.get("/auth/register", (req, res) => res.render("signup", { error: req.query.error }));


module.exports = router;
