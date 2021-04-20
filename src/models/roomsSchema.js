const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        trim: true
    },
    users:[
        {
            user:{
                type:String,
                required: true
            },
            socketID:{
                type:String,
            },
            pieceColor:{
                type:String
            }
        }
    ]
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"user",
    //     required: true
    // }
})

const room = mongoose.model("room", roomsSchema);

module.exports = room;