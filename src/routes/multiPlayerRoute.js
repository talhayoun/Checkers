const express = require("express");
const path = require("path");
const room = require("../models/roomsSchema");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/usersSchema");

router.get("/rooms", async(req, res)=>{
    res.sendFile(path.join(__dirname, "../../public/rooms.html"))
})

router.post("/rooms", async(req, res)=>{
    console.log(req.body)
    let generateRandomNumber = parseInt(Math.random() * 10000000)
    try{
        const newRoom = await new room({
            room: generateRandomNumber
        })
        console.log(newRoom)
        if(!newRoom){
            return res.status(404).send()
        }
        newRoom.users = newRoom.users.concat({user: req.body.userName})
        await newRoom.save();
        res.send({room: generateRandomNumber});
    }catch{
        res.status(404).send("Failed to create a new room")
    }
})

router.post("/secondUser", async(req, res)=>{
    // console.log(req.body)
    try{
        let updateRoomUser = await room.findOne({room:req.body.room})
        if(updateRoomUser.users.length == 2){
            return res.status(404).send("Two users are in the room already")
        }
        updateRoomUser.users = updateRoomUser.users.concat({user: req.body.userName})
        await updateRoomUser.save();
        res.send()
    }catch(err){
        res.status(404).send("Failed to save second user")
    }
})


router.post("/updateRoom", async(req, res)=>{
    try{
        const updateRoom = await room.findOne({"users.user": req.body.username});
        if(!updateRoom){
            return res.status(404).send("Update room failed")
        }
        for(let i =0; i<updateRoom.users.length; i++){
            if(updateRoom.users[i].user == req.body.username){
                updateRoom.users[i].socketID = req.body.socketID
                updateRoom.users[i].pieceColor = req.body.color
            }
        }
        await updateRoom.save()
        res.send({updateRoom})
    }catch{
        res.status(404).send("Failed to update room")
    }
})

router.post("/updateScore", async(req, res)=>{
    try{
        const roomData = await room.findOne({room: req.body.room});
        let firstUser = null;
        let secondUser = null;
        for(let i = 0; i< roomData.users.length; i++){
            if(roomData.users[i].pieceColor == req.body.color){
                //WINNER HERE
                firstUser = await User.findOne({username:roomData.users[i].user});
            }else{
                // LOOSER HERE
                secondUser = await User.findOne({username:roomData.users[i].user})
            }
        }
        let expecetedWinRateWinner = getExpectedWinRate(firstUser.score, secondUser.score);
        let newRatingWinner = calculateNewRating(firstUser.score, expecetedWinRateWinner, true);
        firstUser.score = parseInt(newRatingWinner);
        await firstUser.save();
        let expecetedWinRateLooser = getExpectedWinRate(firstUser.score, secondUser.score);
        let newRatingLooser = calculateNewRating(secondUser.score, expecetedWinRateLooser, true);
        secondUser.score = parseInt(newRatingLooser);
        await secondUser.save();
        res.send()
    }catch{
        console.log("Fail to save new score")
        res.status(404).send("Failed to save new score");
    }
})

router.get("/usersInRoom/:room", async(req, res)=>{
    console.log("bla")
    // console.log(req.params)
    console.log(req.cookies)
    try{
        const findRoom = await room.findOne({room: req.params.room})
        console.log("2232", findRoom)
        if(findRoom.users.length == 2){
            let users = findRoom.users;
            console.log("send")
            res.send({Users: 2, users})
        }else{
            res.send({Users:1});
        }
    }catch(err){
        console.log(err)
    }
})


router.get("/getRooms", async(req, res)=>{
    let rooms = await room.find();
    res.send({rooms})
})

router.get("/waiting", async(req, res)=>{
    res.sendFile(path.join(__dirname, "../../public/waiting.html"))
})

function getExpectedWinRate(playerA, playerB){
    let dividePlayersScore = (playerB - playerA) / 400;
    let pow = Math.pow(10, dividePlayersScore) + 1;
    return 1 / pow;
}

function calculateNewRating(playerScore, winRateExpected, win){
    let score = win == true ? 1 : 0;
    let newRating = 32 * (score - winRateExpected)
    newRating = newRating + playerScore;
    return newRating;
}

module.exports = router;