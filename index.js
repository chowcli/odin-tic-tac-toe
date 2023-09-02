const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const insertMark = (index, marker) => (board[index] = marker);
  const getValueOfIndex = index => board[index];

  // Reset Board
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { insertMark, getValueOfIndex, resetBoard };
})();

const gameController = (() => {
  const mainContainer = document.querySelector(".main-container");

  mainContainer.addEventListener("click", event => {
    const { target } = event;

    if (target.closest(".cell") && !target.textContent) {
      const cellIndex = target.dataset.index;
      const currMarker = roundSetUp.getCurrRoundMarker();
      gameBoard.insertMark(cellIndex, currMarker);

      target.textContent = gameBoard.getValueOfIndex(cellIndex);

      // only check winner starting from round 5
      if (roundSetUp.getRoundNum() >= 5) {
        const result = checkWinner();
        if (result.isWinner) {
          displayResultMess(result, currMarker);
          return;
        }
        if (!result.isWinner && roundSetUp.getRoundNum() === 9) {
          displayResultMess(result, currMarker);
          return;
        }
      }

      roundSetUp.countRound();
    }

    if (target.closest("#resetBtn")) {
      roundSetUp.resetRound();
      gameBoard.resetBoard();
      document.querySelectorAll(".cell").forEach(div => (div.textContent = ""));
    }
  });
})();

// Create player object
const playerFactory = marker => {
  const getMarker = () => marker;

  return { getMarker };
};

const initializePlayer = (() => {
  const player1 = playerFactory("X");
  const player2 = playerFactory("O");

  return { player1, player2 };
})();

// Round management logic
const roundSetUp = (() => {
  let round = 1;

  const countRound = () => round++;

  const getCurrRoundMarker = () => {
    const { player1, player2 } = initializePlayer;
    return round % 2 === 1 ? player1.getMarker() : player2.getMarker();
  };

  const getRoundNum = () => round;

  const resetRound = () => (round = 1);

  return { countRound, getCurrRoundMarker, resetRound, getRoundNum };
})();

// Check winner
const checkWinner = () => {
  const winCondition = [
    // check row
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //check column
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // check diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  const currMarker = roundSetUp.getCurrRoundMarker();

  for (const condition of winCondition) {
    if (
      condition.every(index => gameBoard.getValueOfIndex(index) === currMarker)
    )
      return { isWinner: true, winnerMarker: currMarker };
  }
  return { isWinner: false, winnerMarker: null };
};

const displayResultMess = (result, currMarker) => {
  const modal = document.querySelector(".modal");
  const resultMess = document.querySelector(".resultMess");
  const restartBtn = document.getElementById("restartBtn");

  if (result.isWinner) {
    modal.showModal();
    resultMess.textContent = `Player ${currMarker} wins!`;
  }
  if (!result.isWinner) {
    modal.showModal();
    resultMess.textContent = `It's a draw!`;
  }

  restartBtn.addEventListener("click", () => {
    roundSetUp.resetRound();
    gameBoard.resetBoard();
    document.querySelectorAll(".cell").forEach(div => (div.textContent = ""));
    modal.close();
  });
};
