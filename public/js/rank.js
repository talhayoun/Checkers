const table = document.getElementById("table");
window.addEventListener("load", ()=>{
    fetch("http://localhost:3000/getRank")
        .then((res)=>{
            return res.json();
        }).then((jsonObj)=>{
            let newScoresArray = jsonObj.scores.sort((a, b) => b - a)
            let newScoresArrayLength = newScoresArray.length;
            let usersArrayLength = jsonObj.users.length;
            let count = 1;
            for(let i = 0; i< newScoresArrayLength; i++){
                for(let g = 0; g < usersArrayLength; g++){
                    if(jsonObj.users[g].score == newScoresArray[i]){
                        let createNewTR = document.createElement("tr");
                        let createNewTDRank = document.createElement("td");
                        let createNewTDName = document.createElement("td");
                        let createNewTDScore = document.createElement("td");
                        createNewTDRank.innerHTML = "#" + count;
                        createNewTDName.innerHTML = jsonObj.users[g].username;
                        createNewTDScore.innerHTML = jsonObj.users[g].score;
                        createNewTR.appendChild(createNewTDRank);
                        createNewTR.appendChild(createNewTDName);
                        createNewTR.appendChild(createNewTDScore);
                        table.appendChild(createNewTR);
                        newScoresArray.splice(i, 1)
                        i = -1;
                        count++;
                        jsonObj.users.splice(g, 1)
                        break;
                    }
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
})