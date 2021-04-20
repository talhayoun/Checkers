const jwt = require("jsonwebtoken");
const User = require("../models/usersSchema")

const auth = async(req, res,next) =>{
    try{
        const userToken = req.cookies.token_id;
        const verifyToken = jwt.verify(userToken, process.env.SECRET_TOKEN)
        const user = await User.findOne({
            _id: verifyToken._id,
            "tokens.token": userToken,
        })
        if(!user){
            throw new Error("Not verfied token");
        }
        req.user = user;
        req.token = userToken;
        next();
    }catch{
        return res.status(404).send("Token invalid")
    }
}

module.exports = auth;