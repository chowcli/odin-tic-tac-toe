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

  const resetRound = () => (round = 1);

  return { countRound, getCurrRoundMarker, resetRound };
})();
