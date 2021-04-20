const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const port = process.env.PORT;

require("./src/db/mongoose")
const myPublicDirectory = path.join(__dirname, "/public")
const selfGameRouter = require("./src/routes/selfGameRoute")
const multiPlayerRouter = require("./src/routes/multiPlayerRoute")
const homePageRoute = require("./src/routes/homepageRoute");
const room = require("./src/models/roomsSchema");
const app = express();
const server = http.createServer(app)
const io = socketio(server);
const cookieSession = require("cookie-session")
require("./src/passport");
app.use(express.static(myPublicDirectory))
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(homePageRoute)
app.use(selfGameRouter);
app.use(multiPlayerRouter)



// Google authenitcation

app.use(cookieSession({
    name: 'google-session',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize());
app.use(passport.session());

app.get('/google', passport.authenticate('google', { scope: ["profile", "email"] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  async function(req, res) {
    let user = req.user;
    const token = await user.activateToken();
    res.cookie("token_id", token);
    res.redirect(`/?username=${user.username}`);
  });

// Sockets
let onlineUsers = [];
io.on("connection", (socket)=>{
    console.log(onlineUsers)
    socket.emit("usersList", onlineUsers)
    socket.on("userLoggedIn", (username)=>{
        let newUser = {socketID: socket.id, username: username};
        onlineUsers.push(newUser)
        io.emit("usersList", onlineUsers)
    })

    socket.on("sendMessage", (msg, userName)=>{
        io.emit("message", userName, msg)
    })

    socket.on("gameMessage", (msg, userName, room)=>{
        io.to(room).emit("message", userName, msg)
    })

    socket.on("sendGameRequest", (username, usernameThatSentRequest)=>{
        for(let i = 0; i< onlineUsers.length; i++){
            if(onlineUsers[i].username == username){
                io.to(onlineUsers[i].socketID).emit("SendJoinRequest", socket.id, usernameThatSentRequest)
                break;
            }
        }
    })

    socket.on("joinRequestAccepted", (socketID, room)=>{
        io.to(socketID).emit("friendAcceptedGame", room)
    })

    socket.on("join", (room)=>{
        socket.join(room);
        console.log(socket.id + " has joined room " + room)
    })
    socket.on("getID", ()=>{
        socket.emit("SocketID", socket.id)
    })

    socket.on("winner", (room, winner)=>{
        io.to(room).emit("updateWinner", winner)
    })

    socket.on("startGame", (room)=>{
        io.to(room).emit("Start")
    })
    
    socket.on("newBoard", (board, room)=>{
        io.to(room).emit("updateBoard", board);
    })
    socket.on("disconnect", async(sock)=>{
        let user = null;
        for(let i =0; i<onlineUsers.length; i++){
            if(onlineUsers[i].socketID == socket.id){
                user = onlineUsers[i].username;
                onlineUsers.splice(i, 1);
                break;
            }
        }
        if(user !== null){
            io.emit("userLeft", user)
        }
        const currentRoom = await room.findOneAndDelete({"users.socketID": socket.id})
        if(!currentRoom){
            console.log("Failed to find room")
            return;
        }
        io.to(currentRoom.room).emit("userLeftRoom")
    })
})


server.listen(port, ()=>{
    console.log("Server connected: " + port)
})
