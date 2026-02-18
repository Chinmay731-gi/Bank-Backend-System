require("dotenv").config()
const app = require("./src/app");
const {connectToDB} = require("./src/config/db")
const PORT = process.env.PORT || 7310;
connectToDB();

app.listen(PORT, () => {
    console.log("Server Started");
});