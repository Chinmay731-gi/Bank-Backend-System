const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema ({
    email : {
        type: String,
        required: [true, "Email is mandatory"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address"],
        unique: [true, "Email already existed"],
    },
    name : {
        type: String,
        required: [true, "Name is mandatory"],
    },
    password : {
        type: String,
        required: [true, "Password is mandatory"], 
        minlength: [6, "Password should be minimum of 6 character"],
        select: false,
    },
    systemUser:{
        type: Boolean,
        default:false,
        select:false,
    }
},{
    timestamps:true
})  

userSchema.pre("save", async function(next){
   if(!this.isModified("password")) {
    return
   }
   const hash = await bcrypt.hash(this.password, 10)
   this.password = hash;
   return 
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
