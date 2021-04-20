const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    googleID:{
        type:String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    tokens: [
        {
            token:{
                type:String,
                required: true
            }
        }
    ],
    score: {
        type:Number,
        default:1200
    }
})

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.activateToken = async function(){
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id
        },
        process.env.SECRET_TOKEN,
        {
            expiresIn: "1h"
        }   
    )
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

const User = mongoose.model("User", userSchema);


module.exports = User;