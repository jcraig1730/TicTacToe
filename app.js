const gameBoard = document.querySelector("#game-board");
const topLeft = document.querySelector("#top-row .left");
const topMiddle = document.querySelector("#top-row .middle");
const topRight = document.querySelector("#top-row .right");
const middleLeft = document.querySelector("#middle-row .left");
const middleMiddle = document.querySelector("#middle-row .middle");
const middleRight = document.querySelector("#middle-row .right");
const bottomLeft = document.querySelector("#bottom-row .left");
const bottomMiddle = document.querySelector("#bottom-row .middle");
const bottomRight = document.querySelector("#bottom-row .right");
const turnText = document.querySelector(".turn");
const msg = document.querySelector("#msg");
const reset = document.querySelector(".reset");
const newGame = document.querySelector(".new-game");
const player1Score = document.querySelector(".player-1-score");
const player2Score = document.querySelector(".player-2-score");
const player1NameSubmit = document.querySelector(".player-1-name-submit");
const player2NameSubmit = document.querySelector(".player-2-name-submit");

let gameState = {
  player: null,
  board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  p1Score: 0,
  p2Score: 0,
  player1Name: null,
  player2Name: null
};

const nextTurn = () => {
  if (gameState.player === "Player 1") {
    gameState.player = "Player 2";
  } else {
    gameState.player = "Player 1";
  }
  if (gameState.player === "Player 1") {
    turnText.innerText = `${gameState.player1Name || gameState.player}'s turn`;
  } else {
    turnText.innerText = `${gameState.player2Name || gameState.player}'s turn`;
  }
};

const declareWinner = winner => {
  if (winner === 1) {
    gameState.p1Score++;
    winner = gameState.player1Name || "Player 1";
    player1Score.innerText = `${winner}: ${gameState.p1Score}`;
  } else {
    gameState.p2Score++;
    winner = gameState.player2Name || "Player 2";
    player2Score.innerText = `${winner}: ${gameState.p2Score}`;
  }
  msg.innerText = `${winner} wins!`;
  gameBoard.removeEventListener("click", handleClick, false);
};

const checkWinner = () => {
  // check for one player across an entire row
  gameState.board.forEach(row => {
    if (row[0] !== 0 && row[0] === row[1] && row[1] === row[2]) {
      let winner = row[0];
      return declareWinner(winner);
    }
  });

  // check for one player across an entire col
  for (let col = 0; col < 3; col++) {
    if (
      gameState.board[0][col] !== 0 &&
      gameState.board[0][col] === gameState.board[1][col] &&
      gameState.board[1][col] === gameState.board[2][col]
    ) {
      let winner = gameState.board[0][col];
      return declareWinner(winner);
    }
  }

  // check diagonals
  for (let i = 0; i < 3; i++) {
    if (
      gameState.board[0][0] !== 0 &&
      gameState.board[0][0] === gameState.board[1][1] &&
      gameState.board[1][1] === gameState.board[2][2]
    ) {
      let winner = gameState.board[0][0];
      return declareWinner(winner);
    } else if (
      gameState.board[0][2] !== 0 &&
      gameState.board[0][2] === gameState.board[1][1] &&
      gameState.board[1][1] === gameState.board[2][0]
    ) {
      let winner = gameState.board[0][2];
      return declareWinner(winner);
    }
  }

  // check for a draw
  let boardFull = true;
  gameState.board.forEach(row => {
    row.forEach(col => {
      if (col === 0) {
        boardFull = false;
      }
    });
  });
  if (boardFull) {
    msg.innerText = "It's a draw!";
    gameBoard.removeEventListener("click", handleClick, false);
  }
};

const markMatrix = (targetRow, targetCol) => {
  switch (targetRow) {
    case "top-row":
      targetRow = 0;
      break;
    case "middle-row":
      targetRow = 1;
      break;
    case "bottom-row":
      targetRow = 2;
  }
  switch (targetCol) {
    case "left":
      targetCol = 0;
      break;
    case "middle":
      targetCol = 1;
      break;
    case "right":
      targetCol = 2;
      break;
  }
  if (gameState.player === "Player 1") {
    gameState.board[targetRow][targetCol] = 1;
  } else {
    gameState.board[targetRow][targetCol] = 2;
  }
};

const handleClick = e => {
  let targetRow = e.path[1].id;
  let targetCol = e.path[0].classList[0];
  if (!targetRow || !targetCol) {
    msg.innerText = "Location taken, please choose a different square";
  } else {
    let target = document.querySelector(`#${targetRow} .${targetCol}`);
    markMatrix(targetRow, targetCol);

    let newElement = document.createElement("div");
    newElement.className =
      gameState.player === "Player 1" ? "player1" : "player2";
    target.append(newElement);
    msg.innerText = "";
    checkWinner();
    nextTurn();
  }
};

reset.addEventListener("click", () => {
  gameState = {
    player: null,
    board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    p1Score: 0,
    p2Score: 0
  };
  let player1Elements = document.querySelectorAll(".player1");
  player1Elements.forEach(el => el.remove());
  let player2Elements = document.querySelectorAll(".player2");
  player2Elements.forEach(el => el.remove());
  msg.innerText = "";
  gameBoard.addEventListener("click", handleClick);
  player1Score.innerText = `Player 1: ${gameState.p1Score}`;
  player2Score.innerText = `Player 2: ${gameState.p2Score}`;
});

newGame.addEventListener("click", () => {
  gameState.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let player1Elements = document.querySelectorAll(".player1");
  player1Elements.forEach(el => el.remove());
  let player2Elements = document.querySelectorAll(".player2");
  player2Elements.forEach(el => el.remove());
  msg.innerText = "";
  gameBoard.addEventListener("click", handleClick);
});

gameBoard.addEventListener("click", handleClick);

player1NameSubmit.addEventListener("click", () => {
  let name = document.querySelector(".p1-name").value;
  gameState.player1Name = name;
  player1Score.innerText = `${gameState.player1Name}: ${gameState.p1Score}`;
  if (gameState.player === "Player 1") {
    turnText.innerText = `${name}'s turn`;
  }
});

player2NameSubmit.addEventListener("click", () => {
  let name = document.querySelector(".p2-name").value;
  gameState.player2Name = name;
  player2Score.innerText = `${gameState.player2Name}: ${gameState.p2Score}`;
  if (gameState.player === "Player 2") {
    turnText.innerText = `${name}'s turn`;
  }
});

nextTurn();
