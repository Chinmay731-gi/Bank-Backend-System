const mongoose = require("mongoose");

function connectToDB() {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not defined in environment variables");
        process.exit(1);
    }
    
    mongoose.connect(process.env.MONGO_URL)
    .then(() => { 
        console.log("Server is connected to DB");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
        process.exit(1); 
    });
}

module.exports = { connectToDB };