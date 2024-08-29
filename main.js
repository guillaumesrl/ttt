let board, displayController, gameController

function Player(name, marker) {

    function getName() {
        return name;
    }

    function getMarker() {
        return marker;
    }

    function setName(newName) {
        name = newName;
    }

    return {getName, getMarker, setName};
}




board = (function() {

    let board = ["","","","","","","","",""];
    const WinningCombination = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

    function getBoard() {
        return board;
    }

    function setMarker(index, marker) {
        board[index] = marker;
    }

    function checkWinner(player1, player2) {
        for (let combination of WinningCombination) {
            const [a, b, c] = combination;
            if (board[a] && board[a] == board[b] && board[a] == board[c]) {
                return player1.getMarker() === board[a] ? player1 : player2;
            }
        }
        return null;
    }

    function isFull() {
        return !board.includes("")
    }

    function isValidMove(idx) {
        return board[idx] === "";
    }

    function reset() {
        board = ["","","","","","","","",""]
    }

    return {getBoard, isFull, isValidMove, checkWinner, setMarker, reset};
})();


displayController = (function() {
    const cells = Array.from(document.querySelectorAll(".item"));

    function reset() {
        cells.forEach((item) => item.textContent = "")
    }

    function displayMarker(idx, marker) {
        cells[idx].textContent = marker;
    }


    function generateEventListener() {
        cells.forEach((item, index) => {
            item.addEventListener("click", () => gameController.clickHandler(index))
        });
    }

    

    function displayName(player1, player2) {
        const infoDiv = document.querySelector(".info");
        const container1 = document.getElementById("player1-container") || document.createElement("div");
        const container2 = document.getElementById("player2-container") || document.createElement("div");
        
        container1.id = "player1-container";
        container2.id = "player2-container";
        container1.classList.add("line");
        container2.classList.add("line");
    
        if (!player1.getName() || !player2.getName()) {
            // Affichage initial avec les champs input
            container1.innerHTML = `
                <label for="player1-name">Player 1:</label>
                <input type="text" id="player1-name" placeholder="Enter name">
            `;
            container2.innerHTML = `
                <label for="player2-name">Player 2:</label>
                <input type="text" id="player2-name" placeholder="Enter name">
            `;
    
            const buttonLine = document.querySelector(".button-line") || document.createElement("div");
            buttonLine.classList.add("button-line", "line");
            buttonLine.innerHTML = '<button>Start Game</button>';
    
            infoDiv.innerHTML = '';
            infoDiv.appendChild(container1);
            infoDiv.appendChild(container2);
            infoDiv.appendChild(buttonLine);
        } else {
            // Affichage des noms des joueurs après qu'ils ont été saisis
            container1.innerHTML = `${player1.getName()} plays with ${player1.getMarker()}`;
            container2.innerHTML = `${player2.getName()} plays with ${player2.getMarker()}`;
    
            const buttonLine = document.querySelector(".button-line");
            if (buttonLine) buttonLine.remove();
    
            infoDiv.innerHTML = '';
            infoDiv.appendChild(container1);
            infoDiv.appendChild(container2);
        }
    }

    function displayOrUpdateCurrentPlayer(currentPlayer) {
        const globalDiv = document.querySelector(".info");
        let currentDiv = document.querySelector(".current");
        if (currentDiv) {
            currentDiv.textContent = `${currentPlayer.getName()}'s turn`
        } else {
            currentDiv = document.createElement("div");
            currentDiv.classList.add("line");
            currentDiv.classList.add("current");
            currentDiv.textContent = `${currentPlayer.getName()}'s turn`
            globalDiv.append(currentDiv);
        }
    }


    return {reset, generateEventListener, displayMarker, displayName, displayOrUpdateCurrentPlayer};
})();

gameController = (function() {
    const player1 = Player("", "X");
    const player2 = Player("", "O");
    const header = document.getElementsByName("header");
    let currentPlayer = player1;
    let isOver = false;
    

    function reset() {
        board.reset();
        displayController.reset();
        currentPlayer = player1;
        isOver = false;
        displayController.displayName(player1, player2);
    }

    function makeMove(idx, marker) {
        board.setMarker(idx, marker);
        displayController.displayMarker(idx, marker);
    }

    function announceWinner(winner) {
        const infoDiv = document.querySelector(".info");
        infoDiv.innerHTML = '';

        const winDiv = document.createElement("div");
        winDiv.classList.add("win");
        winDiv.textContent = `🎉 ${winner.getName()} wins 🎉`

        const buttonLine = document.createElement("div");
        buttonLine.classList.add("button-line");
        buttonLine.classList.add("line");

        const button = document.createElement("button");
        button.textContent = "Play again ?"
        buttonLine.append(button);

        infoDiv.append(winDiv);
        infoDiv.append(buttonLine);

        button.addEventListener("click", gameController.reset);
    }
 
    function announceDraw() {
        const infoDiv = document.querySelector(".info");
        infoDiv.innerHTML = '';

        const loseDiv = document.createElement("div");
        loseDiv.classList.add("lose");
        loseDiv.textContent = `🤯 it's a tie 🤯`

        const buttonLine = document.createElement("div");
        buttonLine.classList.add("button-line");
        buttonLine.classList.add("line");

        const button = document.createElement("button");
        button.textContent = "Play again ?"
        buttonLine.append(button);

        infoDiv.append(loseDiv);
        infoDiv.append(buttonLine);

        button.addEventListener("click", gameController.reset);
    } 

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function clickHandler(index) {
        if (isOver) {return };
        if (board.isValidMove(index)) {
            makeMove(index, currentPlayer.getMarker());
            const winner = board.checkWinner(player1, player2);
            if (winner) {
                announceWinner(winner);
                isOver = true;
            } else if (board.isFull()) {
                announceDraw();
            } else {
                switchPlayer();
                displayController.displayOrUpdateCurrentPlayer(currentPlayer);
            }
        }

    }

    function setPlayerName() {
        const globalElement = document.querySelector(".info");
        const player1Element = document.getElementById("player1-name");
        const player2Element = document.getElementById("player2-name");
        const buttonElement = document.querySelector("button");
        let alertElement = document.querySelector(".alert");


        function removeAlert() {
            if (alertElement) {
                alertElement.remove();
                alertElement = null;
            }
        }

        function createOrUpdateAlert(message) {
            if (!alertElement) {
                alertElement = document.createElement("div");
                alertElement.classList.add("line", "alert");
                globalElement.appendChild(alertElement);
            }
            alertElement.textContent = message;
        }

        buttonElement.addEventListener("click", () => {
            const player1Name = player1Element.value;
            const player2Name = player2Element.value;
            if (player1Name && player2Name) {
                player1.setName(player1Name);
                player2.setName(player2Name);
                removeAlert();
                init();

            } else {
                createOrUpdateAlert("Please enter a name for each player before submitting.");
            }
        } )
    }

    function init() {
        displayController.displayName(player1, player2);
        displayController.generateEventListener(clickHandler);
        displayController.displayOrUpdateCurrentPlayer(currentPlayer);
    }

    setPlayerName();


    return {reset, clickHandler, player1, player2}
})();





