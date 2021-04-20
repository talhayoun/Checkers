board = [
    null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, //7
    {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, //15
    null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, null, {isWhite: true, isKing: false}, //23
    null, null, null, null, null, null, null, null, // 31
    null, null, null, null, null, null, null, null,// 39
    {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, //47
    null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, //55
    {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null, {isWhite: false, isKing: false}, null // 63
  ];

const gameBoard = document.getElementById("board");
for(let i = 0; i < 8; i++){
    for(let g = 0; g < 8; g++){
        let createDiv = document.createElement("div");
        if(i === 0 || i === 2 || i === 4 || i === 6){
            if(g % 2 == 0){
                createDiv.className = "white";
            }
            else{
                createDiv.className = "black";
            }
        }
        if(i === 1|| i === 3 || i === 5 || i === 7){
            if(g % 2 == 0){
                createDiv.className = "black";
            }
            else{
                createDiv.className = "white";
            }
        }
        gameBoard.appendChild(createDiv);
    }
}

let countTwoClickRemovePickedPiece = 0;
let newLocationAfterEatingPiece = 0;
let totalGameMoves = 0;
let totalBlackPieces = 12;
let totalWhitePieces = 12;
let nextRequiredSquare = []
let whiteBlackRequiredSquare = []
let piecePicked = false;
let canEatAnother = false;
let pickedPiece;
let newLocationAfterMoval;
let wasOpponentPieceEaten = false;
let getBlackTurn = document.getElementById("blackturn")
let getWhiteTurn = document.getElementById("whiteturn")


for(let i=0; i<64; i++){
    if(board[i] !== null){
        if(board[i].isWhite == true){
            let newWhitePiece = document.createElement("div");
            newWhitePiece.className = "whitePiece";
            gameBoard.children[i].appendChild(newWhitePiece);
        }
        if(board[i].isWhite == false){
            let newBlackPiece = document.createElement("div");
            newBlackPiece.className = "blackPiece";
            gameBoard.children[i].appendChild(newBlackPiece);
        }
    }
    gameBoard.children[i].addEventListener("click", (event)=>{
        doesPieceMustEat(i)
    })
    
}

function printBoard(board){
    for(let i=0; i<64; i++){
            if(gameBoard.children[i].children.length > 0){
                let pieceClassName = gameBoard.children[i].children[0].className == "whitePiece" ? true:false;
                let boardPieceName;
                if(board[i] == null){boardPieceName = null;}
                else if(board[i].isWhite == true){boardPieceName = true}
                else{boardPieceName = false;}
                if(pieceClassName !== boardPieceName){
                    gameBoard.children[i].removeChild(gameBoard.children[i].children[0]);
                    if(board[i] !== null){
                        if(board[i].isWhite == true){
                            let newWhitePiece = document.createElement("div");
                            newWhitePiece.className = "whitePiece";
                            gameBoard.children[i].appendChild(newWhitePiece);
                        }
                        if(board[i].isWhite == false){
                            let newBlackPiece = document.createElement("div");
                            newBlackPiece.className = "blackPiece";
                            gameBoard.children[i].appendChild(newBlackPiece);
                        }
                        if(board[i].isKing == true && board[i].isWhite == true){
                            let newWhiteKing = document.createElement("div");
                            newWhiteKing.className = "whitePiece";
                            let createKingCrown = document.createElement("div");
                            createKingCrown.className = "whiteKingCrown";
                            gameBoard.children[i].id = "currentKingID"
                            let currentKing = document.getElementById("currentKingID");
                            newWhiteKing.appendChild(createKingCrown);
                            currentKing.appendChild(newWhiteKing);
                            //addAttributesToCurrentPiece(i)
                            gameBoard.children[i].id = ""
                        }
                        if(board[i].isKing == true && board[i].isWhite == false){
                            let newBlackKing = document.createElement("div");
                            newBlackKing.className = "blackPiece";
                            let createKingCrown = document.createElement("div");
                            createKingCrown.className = "blackKingCrown";
                            gameBoard.children[i].id = "currentKingID"
                            let currentKing = document.getElementById("currentKingID");
                            newBlackKing.appendChild(createKingCrown);
                            currentKing.appendChild(newBlackKing);
                            //addAttributesToCurrentPiece(i)
                            gameBoard.children[i].id = ""
                        }
                    }
                }
            
        }
        else{
            if(board[i] !== null){
                if(board[i].isWhite == true && board[i].isKing == false){
                    let newWhitePiece = document.createElement("div");
                    newWhitePiece.className = "whitePiece";
                    gameBoard.children[i].appendChild(newWhitePiece);
                    addAttributesToCurrentPiece(i)
                }
                if(board[i].isWhite == false && board[i].isKing == false){
                    let newBlackPiece = document.createElement("div");
                    newBlackPiece.className = "blackPiece";
                    gameBoard.children[i].appendChild(newBlackPiece);
                    addAttributesToCurrentPiece(i)
                }
                if(board[i].isKing == true && board[i].isWhite == true){
                    let newWhiteKing = document.createElement("div");
                    newWhiteKing.className = "whitePiece";
                    let createKingCrown = document.createElement("div");
                    createKingCrown.className = "whiteKingCrown";
                    gameBoard.children[i].id = "currentKingID"
                    let currentKing = document.getElementById("currentKingID");
                    newWhiteKing.appendChild(createKingCrown);
                    currentKing.appendChild(newWhiteKing);
                    addAttributesToCurrentPiece(i)
                    gameBoard.children[i].id = ""
                }
                if(board[i].isKing == true && board[i].isWhite == false){
                    let newBlackKing = document.createElement("div");
                    newBlackKing.className = "blackPiece";
                    let createKingCrown = document.createElement("div");
                    createKingCrown.className = "blackKingCrown";
                    gameBoard.children[i].id = "currentKingID"
                    let currentKing = document.getElementById("currentKingID");
                    newBlackKing.appendChild(createKingCrown);
                    currentKing.appendChild(newBlackKing);
                    addAttributesToCurrentPiece(i)
                    gameBoard.children[i].id = ""
                }
            }
        }
    }
}

function doesPieceMustEat(piece){
    let pieceMustEat;
    let currentPieceTurn = whoseTurn()
    if(piecePicked === true){
        verifyPieceMovement(piece);
        if(piecePicked){
            blackSquare(piece)
        }
    }
    else{
        if(board[piece] !== null){
            if(board[piece].isWhite == true && currentPieceTurn == "whitePiece"){currentPieceTurn = true}
            if(board[piece].isWhite == false && currentPieceTurn == "blackPiece"){currentPieceTurn = false}
            if(board[piece].isWhite == currentPieceTurn){
                    pieceMustEat = currentPieceTurn == false ? loopCanBlackEatWhite():loopCanWhiteEatBlack();
                    if(whiteBlackRequiredSquare.length > 0){
                        if(whiteBlackRequiredSquare[0] == piece || whiteBlackRequiredSquare[1] == piece){
                            verifyPieceMovement(piece);
                        }   
                    }
                    else{
                        verifyPieceMovement(piece);
                    }
                }
            }
        }
    }

function verifyPieceMovement(piece){
    countTwoClickRemovePickedPiece++;
    if(!piecePicked){
            addAttributesToCurrentPiece(piece)
    }
    if(!canEatAnother){
        if(pickedPiece == piece){
            if(countTwoClickRemovePickedPiece >= 2){
                removeAttributeToPiece(piece);
                countTwoClickRemovePickedPiece = 0;
            } 
        }
    }
    //board[piece].stopPropagation();
}

function blackSquare(currentSquare){
    let canEatOneMore;
    let moveLegal = false;
    if(canEatAnother){
        if(currentSquare == newLocationAfterEatingPiece){
            let threatnedPiece = findThreatnedPiece(pickedPiece, currentSquare)
            eatOpponenetPiece(threatnedPiece, pickedPiece, currentSquare);
            moveLegal = true;
        }
    }
    else if(nextRequiredSquare.length > 0){
        if(isPieceMustEat(currentSquare, pickedPiece)){moveLegal = true;}
    }
    else if(board[pickedPiece].isKing == true){
        if(isKingMoveLegal(pickedPiece, currentSquare)){
                if(!wasOpponentPieceEaten){
                    board[currentSquare] = board[pickedPiece];
                    board[pickedPiece] = null
                    printBoard(board)
                }
                moveLegal = true;
        }
    }
    else{
        if(isMoveLegal(pickedPiece, currentSquare) == true){
            if(board[currentSquare] == null){
                let tempPickedPiece;
                tempPickedPiece = board[pickedPiece];
                board[pickedPiece] = board[currentSquare];
                board[currentSquare] = tempPickedPiece;
                moveLegal = true;
                printBoard(board)
            }
        }
    }
    isKing(pickedPiece);
    if(wasOpponentPieceEaten){
        canEatOneMore = canBlackEatAnother(pickedPiece)
        if(!canEatOneMore){wasOpponentPieceEaten = false;}
    }
    if(moveLegal && !wasOpponentPieceEaten){
        makeMove(pickedPiece)
        moveLegal = false;
        newLocationAfterEatingPiece = 0;
    }
}

function canBlackEatAnother(currentPiece){
    let newLocation = 0;
    let pieceInBetween = 0;
    let isPossible = false;
    newLocation = currentPiece - 14;
    pieceInBetween = currentPiece - (14 / 2)
    isPossible = isEatingAnotherPossible(pieceInBetween, newLocation, currentPiece)
    if(isPossible){newLocationAfterEatingPiece = newLocation}
    newLocation = currentPiece - 18;
    pieceInBetween = currentPiece - (18 / 2);
    if(!isPossible){
        isPossible = isEatingAnotherPossible(pieceInBetween, newLocation, currentPiece)
        if(isPossible){newLocationAfterEatingPiece = newLocation}
    }
    newLocation = currentPiece + 18;
    pieceInBetween = currentPiece + (18 / 2);
    if(!isPossible){
        isPossible = isEatingAnotherPossible(pieceInBetween, newLocation, currentPiece)
        if(isPossible){newLocationAfterEatingPiece = newLocation}
    }
    newLocation = currentPiece + 14;
    pieceInBetween = currentPiece + (14 / 2);
    if(!isPossible){
        isPossible = isEatingAnotherPossible(pieceInBetween, newLocation, currentPiece)
        if(isPossible){newLocationAfterEatingPiece = newLocation}
    }
    return isPossible;
}

function isEatingAnotherPossible(pieceInBetween, newLocation, currentPiece){
    if(pieceInBetween != 0 && pieceInBetween <= 64 && pieceInBetween >= 1){
        if(newLocation != 0 && newLocation <= 64 && newLocation >= 1){
            if(currentPiece != 0 && currentPiece <= 64 && currentPiece >= 1){
                if(isEatingPossibleTest(pieceInBetween, currentPiece, newLocation)){
                    canEatAnother = true;
                    return true;
                }
            }
        }
    }
    return false;
}


function isKing(currentPiece){
    if(board[currentPiece] !== null){
        if(board[currentPiece].isWhite == true){
            if(currentPiece == 56 || currentPiece == 58 || currentPiece == 60 || currentPiece == 62){
                // if(currentPiece.hasChildNodes() == false){
                    makeWhitePieceKing(currentPiece)
                // }
            }
        }
        if(board[currentPiece].isWhite == false){
            if(currentPiece == 1 || currentPiece == 3 || currentPiece == 5 || currentPiece == 7){
                // if(currentPiece.hasChildNodes() == false){
                    makeBlackPieceKing(currentPiece);
                // }
            }
        }
    }
}

function makeWhitePieceKing(currentPiece){
    board[currentPiece].isKing = true;
    let createKingCrown = document.createElement("div");
    createKingCrown.className = "whiteKingCrown";
    currentPiece = document.getElementById(currentPiece);
    currentPiece.appendChild(createKingCrown);
}

function makeBlackPieceKing(currentPiece){
    board[currentPiece].isKing = true;
    let createKingCrown = document.createElement("div");
    createKingCrown.className = "blackKingCrown";
    currentPiece = document.getElementById(currentPiece);
    currentPiece.appendChild(createKingCrown);
}


function isPieceMustEat(currentSquare, currentPiece){
    for(let i = 0; i < nextRequiredSquare.length; i++){
        if(currentSquare == nextRequiredSquare[i]){
            if(whiteBlackRequiredSquare[i] == currentPiece){
                nextRequiredSquare = []
                whiteBlackRequiredSquare = []
                if(board[currentPiece].isKing == true){
                    isKingMoveLegal(currentPiece, currentSquare)
                }
                else{
                    isMoveLegal(currentPiece, currentSquare)
                }
                return true;
            }
        }
    }
}

function setWhoseTurnDiv(){
    let currentPieceTurn = totalGameMoves % 2 == 0 ? "whitePiece" : "blackPiece";
    if(currentPieceTurn == "whitePiece"){
        getWhiteTurn.className = "";
        getBlackTurn.className = "none";
    }
    if(currentPieceTurn == "blackPiece"){
        getBlackTurn.className = "";
        getWhiteTurn.className = "none";
    }
    isGameOver();
}

function makeMove(currentPiecePicked){
    //currentPiecePicked = document.getElementById(currentPiecePicked);
    removeAttributeToPiece(currentPiecePicked)
    totalGameMoves++;
    setWhoseTurnDiv()
    countTwoClickRemovePickedPiece = 0;
    canEatAnother = false;
    pickedPiece = null;
    nextRequiredSquare = []
    whiteBlackRequiredSquare = []
}

function isGameOver(){
    let getWinnerDiv = document.getElementById("winner");
    let isWinner = false;
    if(totalWhitePieces == 0){
        getWinnerDiv.innerHTML = "Black Wins"
        isWinner = true;
    }
    if(totalBlackPieces == 0){
        getWinnerDiv.innerHTML = "White Wins"
        isWinner = true;
    }
    if(isWinner){
        getWinnerDiv.id = "";
        getWinnerDiv.className = "wins";
        getWhiteTurn.className = "none";
        getBlackTurn.className = "none";
    }
}

function isMoveLegal(currentPiece, nextLocation){
    let currentPieceTurn = whoseTurn()
    let isTryingToEat = false;
    let isRegularMove = false;
    if(currentPieceTurn == "whitePiece"){
        isTryingToEat = isWhiteTryingToEatMoveLegal(nextLocation, currentPiece);
        isRegularMove = isWhiteRegularMoveLegal(nextLocation, currentPiece)
    }
    if(currentPieceTurn == "blackPiece"){
        isTryingToEat = isBlackTryingToEatMoveLegal(nextLocation, currentPiece)
        isRegularMove = isBlackRegularMoveLegal(nextLocation, currentPiece)
    }
    if(isTryingToEat){
        let threatnedPiece = findThreatnedPiece(currentPiece, nextLocation)
        if(isEatingPossibleTest(threatnedPiece, currentPiece, nextLocation)){
            eatOpponenetPiece(threatnedPiece, currentPiece, nextLocation)
        }
        else{
            isTryingToEat = false;
        }
    }
    if(isTryingToEat || isRegularMove){return true;}
    return false;
}


function isWhiteTryingToEatMoveLegal(nextLocation, currentPiece){
    let isTryingToEatMove = false;
    if(currentPiece - nextLocation == -18 || currentPiece - nextLocation == -14){
        isTryingToEatMove = true
    }
    return isTryingToEatMove;
}

function isWhiteRegularMoveLegal(nextLocation, currentPiece){
    let isRegularMoveLegal = false;
    if(currentPiece - nextLocation == -9 || currentPiece - nextLocation == -7){
        isRegularMoveLegal = true
    }
    return isRegularMoveLegal;
}

function isBlackTryingToEatMoveLegal(nextLocation, currentPiece){
    let isTryingToEatMove = false;
    if(currentPiece - nextLocation == 18 || currentPiece - nextLocation == 14){
        isTryingToEatMove = true;
    }
    return isTryingToEatMove;
}
function isBlackRegularMoveLegal(nextLocation, currentPiece){
    let isRegularMove = false;
    if(currentPiece - nextLocation == 7 || currentPiece - nextLocation == 9){
        isRegularMove = true
    }
    return isRegularMove;
}



function eatOpponenetPiece(pieceThreatnedLocation, currentPiece, nextLocation){
    if(board[pieceThreatnedLocation].isWhite == true || board[pieceThreatnedLocation].isWhite == false){
        let currentPieceName = getCurrentPieceName(currentPiece)
        let threatnedPieceName = getPieceThreatnedName(pieceThreatnedLocation)
        if(threatnedPieceName != currentPieceName){
            board[nextLocation] = board[currentPiece];
            board[pieceThreatnedLocation] = null
            board[currentPiece] = null
            printBoard(board);
            if(threatnedPieceName == "whitePiece"){
                totalWhitePieces--;
            }
            if(threatnedPieceName == "blackPiece"){
                totalBlackPieces--;
            }
            wasOpponentPieceEaten = true;
            pickedPiece = nextLocation;
        }     
    }           
}

function addAttributesToCurrentPiece(currentPiece){
    pickedPiece = currentPiece;
    gameBoard.children[currentPiece].children[0].id = currentPiece;
    currentPiece = document.getElementById(currentPiece);
    currentPiece.style.border = "green 5px solid"
    piecePicked = true;
}

function removeAttributeToPiece(currentPiece){
    currentPiece = document.getElementById(currentPiece);
    currentPiece.style = "";
    piecePicked = false;
    currentPiece.id = "";
}

function whoseTurn(){
    let currentPieceTurn = totalGameMoves % 2 == 0 ? "whitePiece" : "blackPiece";
    return currentPieceTurn;
}

function loopCanWhiteEatBlack(){
    let whitePiecesThatCanEatOnly = []
    let threatnedPiece;
    for(let i = 0; i< board.length; i++){
        if(board[i] !== null && board[i].isWhite == true){
            if(board[i].isKing == true){
                if(loopKing(i)){
                    whitePiecesThatCanEatOnly.push(i)
                }
            }
            else if(board[i].isWhite == true){
                let bottomLeftSquare = i + 18;
                if(bottomLeftSquare != 0 && bottomLeftSquare <= 64 && bottomLeftSquare >= 1){
                    threatnedPiece = findThreatnedPiece(i, bottomLeftSquare)
                    if(isEatingPossibleTest(threatnedPiece, i, bottomLeftSquare)){
                    whitePiecesThatCanEatOnly.push(i);
                    pushEatAbleLocationToList(bottomLeftSquare, i)
                    }
                }
                let bottomRightSquare = i + 14;
                if(bottomRightSquare != 0 && bottomRightSquare <= 64 && bottomRightSquare >= 1){
                    threatnedPiece = findThreatnedPiece(i, bottomRightSquare)
                    if(isEatingPossibleTest(threatnedPiece, i, bottomRightSquare)){
                    whitePiecesThatCanEatOnly.push(i)
                    pushEatAbleLocationToList(bottomRightSquare, i)
                    }
                }
            }
        }
    }
    return whitePiecesThatCanEatOnly;
}



function loopCanBlackEatWhite(){
    let blackPiecesThatCanEatOnly = []
    let threatnedPiece;
    for(let i = 0; i< board.length; i++){
        if(board[i] !== null && board[i].isWhite == false){
            if(board[i].isKing == true){
                if(loopKing(i)){
                    blackPiecesThatCanEatOnly.push(i)
                }
            }
            else if(board[i].isWhite == false){
                let bottomLeftSquare = i - 18; //Bottom left square is the square id of next square after eating a piece.
                if(bottomLeftSquare != 0 && bottomLeftSquare <= 64 && bottomLeftSquare >= 1){
                    threatnedPiece = findThreatnedPiece(i, bottomLeftSquare)
                    if(isEatingPossibleTest(threatnedPiece, i, bottomLeftSquare)){
                        blackPiecesThatCanEatOnly.push(i);
                        pushEatAbleLocationToList(bottomLeftSquare, i)
                    }
                }
                let bottomRightSquare = i - 14;
                if(bottomRightSquare != 0 && bottomRightSquare <= 64 && bottomRightSquare >= 1){
                    threatnedPiece = findThreatnedPiece(i, bottomRightSquare)
                    if(isEatingPossibleTest(threatnedPiece, i, bottomRightSquare)){
                        blackPiecesThatCanEatOnly.push(i);
                        pushEatAbleLocationToList(bottomRightSquare, i)
                    }
                }
            }
        }
    }
    return blackPiecesThatCanEatOnly;
}

function findThreatnedPiece(currentPiece, nextLocation){
    let pieceThreatnedLocation = 0;
    // let currentPieceParentElementId = 0;
    pieceThreatnedLocation = currentPiece - nextLocation;
    if(currentPiece - nextLocation == 14 || currentPiece - nextLocation == 18 || currentPiece - nextLocation == -14 || currentPiece - nextLocation == -18){
        pieceThreatnedLocation = (nextLocation - currentPiece) / 2
        pieceThreatnedLocation = currentPiece + pieceThreatnedLocation
    }
    else{
        pieceThreatnedLocation = currentPiece - nextLocation
        if(currentPiece - nextLocation == 14 || currentPiece - nextLocation == 18 || currentPiece - nextLocation == -14 || currentPiece - nextLocation == -18){
            pieceThreatnedLocation = (nextLocation  - currentPiece) / 2
            pieceThreatnedLocation = currentPiece + pieceThreatnedLocation
        }
    }
    //pieceThreatnedLocation = document.getElementById(pieceThreatnedLocation)
    return pieceThreatnedLocation;
}

function isEatingPossibleTest(pieceThreatnedLocation, currentPiece, nextLocation){
    let pieceThreatnedRow = rowNumber(pieceThreatnedLocation);
    let nextLocationRow = rowNumber(nextLocation);
    let pieceThreatnedName = getPieceThreatnedName(pieceThreatnedLocation)
    let currentPieceName = getCurrentPieceName(currentPiece)
    if(board[pieceThreatnedLocation] !== null){
        if(board[nextLocation] == null && (board[pieceThreatnedLocation].isWhite == false || board[pieceThreatnedLocation].isWhite == true)){
            if(currentPiece - pieceThreatnedLocation == 7 || currentPiece - pieceThreatnedLocation == -7 || currentPiece - pieceThreatnedLocation == 9 || currentPiece - pieceThreatnedLocation == -9){
                if(pieceThreatnedRow - nextLocationRow == 1 || pieceThreatnedRow - nextLocationRow == -1){
                    if(pieceThreatnedName !== currentPieceName){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function getCurrentPieceName(piece){
    let currentPieceName = null;
    if(board[piece] !== null){
        if(board[piece].isWhite == false){
            currentPieceName = "blackPiece";
        }
        if(board[piece].isWhite == true){
            currentPieceName = "whitePiece"
        }
    }
    return currentPieceName;
}

function getPieceThreatnedName(piece){
    let pieceThreatnedName = null;
    if(board[piece] !== null){
        if(board[piece].isWhite == false){
            pieceThreatnedName = "blackPiece";
        }
        if(board[piece].isWhite == true){
            pieceThreatnedName = "whitePiece"
        }
    }
    return pieceThreatnedName;
}

function rowNumber(piece){
    let row = 0;
    if(piece >= 0 && piece <=7){
        row = 1;
    }
    if(piece >= 8 && piece <= 15){
        row = 2;
    }
    if(piece >= 16 && piece <= 23){
        row = 3;
    }
    if(piece >= 24 && piece <= 31){
        row = 4;
    }
    if(piece >= 32 && piece <= 39){
        row = 5;
    }
    if(piece >= 40 && piece <= 47){
        row = 6;
    }
    if(piece >= 48 && piece <= 55){
        row = 7;
    }
    if(piece >= 56 && piece <= 63){
        row = 8;
    }
    return row;
}

function pushEatAbleLocationToList(bottomRightSquare, Piece){
    nextRequiredSquare.push(bottomRightSquare)
    whiteBlackRequiredSquare.push(Piece)
}

function isKingMoveLegal(currentPiece, nextLocation){
    let isTryingToEatMove = false;
    let isRegularMoveLegal = false;
    if(currentPiece - nextLocation == -18 || currentPiece - nextLocation == -14 || currentPiece - nextLocation == 18 || currentPiece - nextLocation == 14){
        isTryingToEatMove = true
    }

    if(currentPiece - nextLocation == -9 || currentPiece - nextLocation == -7 || currentPiece - nextLocation == 7 || currentPiece - nextLocation == 9){
        isRegularMoveLegal = true
        wasOpponentPieceEaten = false;
    }
    if(isTryingToEatMove){
        let threatnedPiece = findThreatnedPiece(currentPiece, nextLocation)
        if(isEatingPossibleTest(threatnedPiece, currentPiece, nextLocation)){
            eatOpponenetPiece(threatnedPiece, currentPiece, nextLocation)
        }
    }
    if(isTryingToEatMove || isRegularMoveLegal){return true;}
    return false;
}

function loopKing(Piece){
    let nextLocationId = Piece - 18;
    let countOptions = 0;
    let isKingEatingPossible = false;
    let currentPieceName = null;
    let threatnedPieceName = null;
    while(countOptions < 4){
        if(countOptions == 1){ nextLocationId = Piece + 18}
        if(countOptions == 2){ nextLocationId = Piece - 14}
        if(countOptions == 3){ nextLocationId = Piece + 14}
        if(nextLocationId <= 64 && nextLocationId >= 1){
            if(Piece - nextLocationId == 18 || Piece - nextLocationId == 14){
                threatnedPiece = findThreatnedPiece(Piece, nextLocationId);
                if(board[threatnedPiece] !== null){
                    if(board[threatnedPiece].isWhite == true || board[threatnedPiece].isWhite == false){
                        threatnedPieceName = getPieceThreatnedName(threatnedPiece)
                        currentPieceName = getCurrentPieceName(Piece)
                        if(threatnedPieceName !== currentPieceName){
                            isKingEatingPossible = isEatingPossibleTest(threatnedPiece, Piece ,nextLocationId)
                        }
                    }
                }
            }
            if(Piece - nextLocationId == -18 || Piece - nextLocationId == -14){
                threatnedPiece = findThreatnedPiece(Piece, nextLocationId)
                if(board[threatnedPiece] !== null){
                    if(board[threatnedPiece].isWhite == true || board[threatnedPiece].isWhite == false){
                        threatnedPieceName = getPieceThreatnedName(threatnedPiece)
                        currentPieceName = getCurrentPieceName(Piece)
                        if(threatnedPieceName !== currentPieceName){
                            isKingEatingPossible = isEatingPossibleTest(threatnedPiece, Piece ,nextLocationId)
                        }
                    }
                }
            }
        }
        if(isKingEatingPossible){pushEatAbleLocationToList(nextLocationId, Piece)}
        countOptions++;
        isKingEatingPossible = false;
        
    }
    return isKingEatingPossible;
}