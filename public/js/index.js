// ROOM
const newGameButton = document.getElementById("newGame");
const newGameForm = document.getElementById("newGameForm");
const roomsList = document.getElementById("table");
const roomsListDiv = document.getElementById("roomsList")
let userName = localStorage.Username


// If user has valid token, show chat
const chatDiv = document.getElementById("chat");
const logOutUsername = document.getElementById("logoutUsername");
const logOutDiv = document.getElementById("logOut");

window.addEventListener("load", ()=>{
    if(location.href.includes("username=")){
        let name = location.href.split("=")[1].slice(0, -1).replace("%20", " ")
        localStorage.setItem("Username", name)
        location.href = "/"
    }
    fetch("http://localhost:3000/tokenValid")
        .then((res)=>{
            if(res.ok){
                loginForm.style.display = "none";
                chatDiv.style.display = "block"
                logOutDiv.style.display = "block"
                logOutUsername.innerHTML = `Welcome, ${localStorage.Username}`
                socket.emit("userLoggedIn", localStorage.Username)
            }else{
                localStorage.removeItem("Username")
            }
        }).catch((err)=>{
            console.log(err)
        })
    
    // ROOM LOGIC
    fetch("http://localhost:3000/getRooms")
    .then((res)=>{
        return res.json();
    }).then((jsonObj)=>{
        console.log(jsonObj.rooms);
        for(let i = 0; i< jsonObj.rooms.length; i++){
            let createNewRoomTR = document.createElement("tr")
            let createNewRoomNumberTD = document.createElement("td");
            let createNewRoomJoin = document.createElement("td")
            let createNewRoomJoinButton = document.createElement("button");

            createNewRoomNumberTD.innerHTML = jsonObj.rooms[i].room;
            createNewRoomJoinButton.type = "click";
            createNewRoomJoinButton.innerHTML = "Join";
            createNewRoomJoin.appendChild(createNewRoomJoinButton);
            createNewRoomTR.appendChild(createNewRoomNumberTD);
            createNewRoomTR.appendChild(createNewRoomJoin);

            roomsList.appendChild(createNewRoomTR)
            // roomsListDiv.appendChild(roomsList)

            createNewRoomJoinButton.addEventListener("click", ()=>{
                if(userName == undefined){
                    alert("You have to sign up or login as guest to create a game");
                    return;
                }
                fetch("http://localhost:3000/secondUser", {
                    method: "POST",
                    body: JSON.stringify({room: createNewRoomNumberTD.innerHTML, userName:userName}),
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((res)=>{
                    if(!res.ok){
                        location.href ="/"
                        return;
                    }
                    localStorage.setItem("Piece", "White")
                    localStorage.setItem("Room", createNewRoomNumberTD.innerHTML)
                    location.href = `/waiting?room=${createNewRoomNumberTD.innerHTML}`
                })
            })
        }
    })
    .catch((err)=>{
        console.log(err);
    })
    
})

// ROOM
newGameButton.addEventListener("click", ()=>{
    if(userName == undefined){
        alert("You have to sign up or login as guest to create a game");
        return;
    }
    fetch("http://localhost:3000/rooms", {
        method: "POST",
        body: JSON.stringify({userName}),
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>{
        return res.json();
    }).then((jsonObj)=>{
        localStorage.setItem("Piece", "Black")
        localStorage.setItem("Room", jsonObj.room)
        location.href = `/waiting?room=${jsonObj.room}`
    }).catch((err)=>{console.log(err)})
})


// --------- Google Button ------
const googleButton = document.getElementById("googleButton");
googleButton.addEventListener("click", ()=>{
    location.href = "/google"
})

// --------- Log Out Button -----
const logOutButton = document.getElementById("loggingout");
logOutButton.addEventListener("click", ()=>{
    fetch("http://localhost:3000/logout")
        .then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err);
        })
})

// --------- Self Game Button-----
const selfButton = document.getElementById("selfGame");
selfButton.addEventListener("click", ()=>{
    location.href = "/self"
})


// --------- Sign in / Sign Up Button -------
const signInButton = document.getElementById("user");
const signInDiv = document.getElementById("login")
const signInForm = document.getElementById("signin");
const signInGoBackButton = document.getElementById("loginback");
signInButton.addEventListener("click", (e)=>{
    e.preventDefault()
    signInDiv.style.display = "block";
    loginForm.style.display = "none"
})
signInGoBackButton.addEventListener("click", (e)=>{
    e.preventDefault();
    signInDiv.style.display = "none";
    loginForm.style.display = "block"
})

// Sign In Form Send 
const loginFormUsernameInput = document.getElementById("loginusername");
const loginFormPasswordInput = document.getElementById("loginpassword");
const loginFormError = document.getElementById("invalidError");
signInForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    if(loginFormPasswordInput.value.length < 4 && loginFormUsernameInput.value.length < 4){
        alert("Enter your login details")
    }
    let userLoginData = {username: loginFormUsernameInput.value, password: loginFormPasswordInput.value}
    fetch("http://localhost:3000/signin", {
        method: "POST",
        body: JSON.stringify(userLoginData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>{
        console.log(res)
        if(!res.ok){
            loginFormError.style.display = "block";
        }
        return res.json()
        // location.href = "/"
    }).then((jsonObj)=>{
        localStorage.setItem("Username", jsonObj.username)
        location.href = "/"
    })
    .catch((err)=>{
        console.log(err);
    })
})

// --------- Sign Up Button ----------
const signUpButton = document.getElementById("signup")
const signUpDiv = document.getElementById("sign")
const signUpForm = document.getElementById("registerForm")
const logInRegisterForm = document.getElementById("registerLogin")
const signUpGoBackButton = document.getElementById("registerback")
signUpButton.addEventListener("click", (e)=>{
    e.preventDefault()
    signInDiv.style.display = "none";
    signUpDiv.style.display = "block"
})

logInRegisterForm.addEventListener("click", (e)=>{
    e.preventDefault()
    signUpDiv.style.display = "none";
    signInDiv.style.display = "block"
})
signUpGoBackButton.addEventListener("click", (e)=>{
    e.preventDefault();
    signUpDiv.style.display = "none";
    loginForm.style.display = "block"
})


// Sign Up Form Inputs Elements
const signUpUsernameInput = document.getElementById("signupname");
const signUpEmailInput = document.getElementById("signupemail");
const signUpPassInput = document.getElementById("signuppass");
const usernameLengthError = document.getElementById("usernameLengthError");
const passwordLengthError = document.getElementById("passwordLengthError");
signUpForm.addEventListener("submit", (e)=>{
    let error = false;
    if(signUpUsernameInput.value.length < 4){
        e.preventDefault();
        usernameLengthError.style.display = "block"
        error = true;
    }
    if(signUpPassInput.value.length < 5){
        e.preventDefault();
        passwordLengthError.style.display = "block"
        error = true;
    }
    if(!error){
        let userData = {username: signUpUsernameInput.value, email:signUpEmailInput.value, password: signUpPassInput.value};
        fetch("http://localhost:3000/signup", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
})
// Online Users List
const socket = io();
const friendsListDiv = document.getElementById("friendsList");
let currentUsers = [];

socket.on("usersList", (onlineUsers)=>{
    for(let i =0; i< onlineUsers.length; i++){
        if(!currentUsers.includes(onlineUsers[i].username)){
            let createUserDiv = document.createElement("div");
            let createNewUser = document.createElement("p");
            createNewUser.className = "friendsP";
            createNewUser.innerHTML = onlineUsers[i].username
            createNewUser.id = onlineUsers[i].username;
            currentUsers.push(onlineUsers[i].username)
            createUserDiv.appendChild(createNewUser)
            friendsListDiv.appendChild(createUserDiv)

            createNewUser.addEventListener("click", ()=>{
                if(localStorage.Username == createNewUser.innerHTML || localStorage.Username == undefined){
                    return;
                }
                console.log(createNewUser.nextElementSibling)
                if(createNewUser.parentElement.childNodes.length == 1){
                    let createJoinButton = document.createElement("button");
                    createJoinButton.innerHTML = "Play";
                    createJoinButton.className = "friendsButton"
                    createNewUser.parentElement.appendChild(createJoinButton)
                    let getClickedUsername = createNewUser.innerHTML;
                    createJoinButton.addEventListener("click", ()=>{
                        socket.emit("sendGameRequest", getClickedUsername, localStorage.Username)
                        createJoinButton.disabled = true
                        setTimeout(() => {
                            createJoinButton.disabled = false
                        }, 5000);
                    })
                }
            })
        }
    }
})
socket.on("SendJoinRequest", (userSentRequestSocketID, usernameThatSentRequest)=>{
    let getDiv = document.getElementById("joinrequest");
    while(getDiv.hasChildNodes()){
        getDiv.removeChild(getDiv.lastChild)
    }
    console.log(userSentRequestSocketID)
    let createDivP = document.createElement("p");
    let createDivJoinButton = document.createElement("button")
    let createDivJoinButtonCancel = document.createElement("button")
    createDivP.innerHTML = `${usernameThatSentRequest} has invited you to a game!`;
    createDivJoinButton.innerHTML = "Accept";
    createDivJoinButtonCancel.innerHTML = "Decline";
    getDiv.appendChild(createDivP);
    getDiv.appendChild(createDivJoinButton);
    getDiv.appendChild(createDivJoinButtonCancel);
    getDiv.style.display ="block"
    createDivJoinButton.addEventListener("click", ()=>{
        fetch("http://localhost:3000/rooms", {
            method: "POST",
            body: JSON.stringify({userName: localStorage.Username}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res)=>{
            return res.json();
        }).then((jsonObj)=>{
            localStorage.setItem("Piece", "Black")
            localStorage.setItem("Room", jsonObj.room)
            socket.emit("joinRequestAccepted", userSentRequestSocketID, jsonObj.room)
            location.href = `/waiting?room=${jsonObj.room}`
        }).catch((err)=>{
            console.log(err, "rooms, index")
        })
    })
    createDivJoinButtonCancel.addEventListener("click", ()=>{
        while(getDiv.hasChildNodes()){
            getDiv.removeChild(getDiv.lastChild)
        }
        getDiv.style.display = "none";
    })
})

socket.on("friendAcceptedGame", (room)=>{
    setTimeout(() => {
        fetch("http://localhost:3000/secondUser", {
            method: "POST",
            body: JSON.stringify({room: room, userName:localStorage.Username}),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res)=>{
            if(!res.ok){
                location.href ="/"
                return;
            }
            localStorage.setItem("Piece", "White")
            localStorage.setItem("Room", room)
            location.href = `/waiting?room=${room}`
        })
    }, 1000);

})

socket.on("userLeft", (user)=>{
    let findUser = document.getElementById(user);
    friendsListDiv.removeChild(findUser.parentElement);
    let findUserIndex = currentUsers.indexOf(user);
    currentUsers.splice(findUserIndex, 1);
})

// Send Message To All Clients


socket.on("message", (userName, message)=>{
        let createnewChatTextUserName = document.createElement("h6");
        createnewChatTextUserName.innerHTML = `${userName}`;
        createnewChatTextUserName.style.fontSize = "20px"
        createnewChatTextUserName.style.display = "inline"

        let currentTimeHour = new Date().getHours()
        let currentTimeMin = new Date().getMinutes()
        currentTimeMin = currentTimeMin < 10 ? "0"+currentTimeMin : currentTimeMin
        let createTime = document.createElement("p");
        createTime.innerHTML = `${currentTimeHour} : ${currentTimeMin}`
        createTime.style.display = "inline"
        createTime.style.marginLeft = "10px"

        let createNewChatText = document.createElement("p");
        createNewChatText.innerHTML = message;
        gameChat.appendChild(createnewChatTextUserName)
        gameChat.appendChild(createTime)
        gameChat.appendChild(createNewChatText)
        chatMessage.value = ""
        chatMessage.focus()
        autoscroll()
})



// Chat Messages
const chatMessage = document.getElementById("message");
const sendMessageButton = document.getElementById("sendMessage")
const gameChat = document.getElementById("gamechat");

sendMessageButton.addEventListener("click", ()=>{
    if(chatMessage.value == ""){
        return;
    }
    socket.emit("sendMessage", chatMessage.value, localStorage.Username);
})

const autoscroll = ()=>{
    const newMessage = gameChat.lastElementChild;
    
    const newMessagesStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessagesStyles.marginBottom)
    const newMessageHeight = 64

    const visibleHeight = gameChat.offsetHeight;

    const containerHeight = gameChat.scrollHeight;

    const scrollOffSet = gameChat.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffSet){
        gameChat.scrollTop = gameChat.scrollHeight
    }
}




// Login Form 
const loginForm = document.getElementById("loginform")
const guestLoginButton = document.getElementById("guest");

let isGuestInputCreated = false;
guestLoginButton.addEventListener("click", ()=>{
    if(isGuestInputCreated){
        return;
    }
    let createGuestInput = document.createElement("input")
    createGuestInput.type = "text";
    createGuestInput.placeholder = "Enter your username: ";
    createGuestInput.className = "guestLogin"
    createGuestInput.id = "guestUserName"
    let createButton = document.createElement("button");
    createButton.innerHTML = "Log In!"
    createButton.style.height = "30px"
    createButton.addEventListener("click", ()=>{
        let guestUserName = document.getElementById("guestUserName")
        if(guestUserName.value == "") {
            return;
        }
        loginForm.style.display = "none";
        localStorage.setItem("Username", guestUserName.value)
        chatDiv.style.display = "block"
    })
    if(!isGuestInputCreated){
        loginForm.appendChild(createGuestInput);
        loginForm.appendChild(createButton)
    }
    isGuestInputCreated = true;
})
