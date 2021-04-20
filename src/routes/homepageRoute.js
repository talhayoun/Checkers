const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/usersSchema");
const bcrypt = require("bcrypt");
const auth = require("../middleware/checkAuth")
const path = require("path");


router.post("/user", async(req, res) =>{
    console.log(req.body)
    // const token = await user.activateToken();
    // res.cookie("token_id", token).send({username: user.username});
    res.send();
})

router.post("/signup", async (req, res)=>{
    try{
        const user = await new User({username: req.body.username, email: req.body.email, password: req.body.password})
        if(!user){
            return res.status(404).send("Failed to create user, 'signup'");
        }
        await user.save();
        res.send()
    }catch(err){
        console.log(err);
        res.status(404).send(err.message)
    }
})
router.post("/signin", async(req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username})
        if(!user){
            return res.status(404).send("User login details are wrong");
        }
        const isPassMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPassMatch){
            return res.status(404).send("Password is wrong");
        }
        const token = await user.activateToken();
        res.cookie("token_id", token).send({username: user.username});
    }catch(err){
        res.status(404).send("Invalid login details");
        console.log(err.message)
    }
})

router.get("/tokenValid", auth ,async(req, res)=>{
    try{
        res.send()
    }catch(err){
        res.status(404).send("Need to login / signup")
    }
})

router.get("/logout", async(req, res)=>{
    try{
        res.cookie("token_id", "").send()
    }catch{
        res.status(404).send("Failed to log out");
    }
})

router.get("/rank", async(req, res)=>{
    res.sendFile(path.join(__dirname, "../../public/rank.html"))
})

router.get("/getRank", async(req, res)=>{
    try{
        let users = await User.find().select("username score")
        let scores = [];
        for(let i = 0; i< users.length; i++){
            scores.push(users[i].score)
        }
        res.send({users, scores});
    }catch{
        res.status(404).send("Failed to get rank")
    }
})
module.exports = router;