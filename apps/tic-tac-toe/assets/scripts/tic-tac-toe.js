import { hideModal, showModal } from "./modal.js";

let currentSide = null;
let playerMove = true;
let game = false;

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const playButton = document.querySelector(".play-btn");
const playCells = document.querySelectorAll(".play-cell");
const sideOptions = document.querySelectorAll(".side-option");

const finalSound = new Audio("assets/sounds/pda.mp3");
finalSound.volume = 0.2;

function playFinalSound() {
  finalSound.currentTime = 0;
  finalSound.play();
}

playButton.addEventListener("click", () => {
  startGame();
});

sideOptions.forEach((option) => {
  option.addEventListener("click", () => {
    pickSide(option);
  });
});

playCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    makePlayerMove(cell);
  });
});

function startGame() {
  playCells.forEach((cell) => {
    const img = cell.querySelector("img");
    if (img) cell.removeChild(img);
    cell.classList.add("active");
  });

  hideModal();

  if (!currentSide) {
    showModal("You'll need pick a side before playing!");
    return;
  }

  game = true;
  playerMove = true;
}

function pickSide(option) {
  sideOptions.forEach((opt) => opt.classList.remove("active"));

  if (game) {
    showModal("You can swap sides mid game!", 2000);
    return;
  }
  option.classList.add("active");

  if (option.classList.contains("stalkers")) {
    currentSide = "stalkers";
  } else if (option.classList.contains("bandits")) {
    currentSide = "bandits";
  }
}

function makePlayerMove(cell) {
  if (!game) return;
  if (!currentSide || !playerMove || cell.querySelector("img")) return;

  const img = document.createElement("img");
  img.src =
    currentSide === "stalkers"
      ? "assets/images/stalkers.webp"
      : "assets/images/bandits.png";

  cell.appendChild(img);

  victoryAlert();
  playerMove = false;

  setTimeout(() => {
    makeComputerMove(currentSide);
    playerMove = true;
  }, 500);
}

function makeComputerMove(playerSide) {
  if (!game) return;
  showModal("Computer's move!", 1000);
  const emptyCells = Array.from(playCells).filter(
    (cell) => !cell.querySelector("img")
  );

  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  const compImg = document.createElement("img");

  const compSide = playerSide === "stalkers" ? "bandits" : "stalkers";
  compImg.src =
    compSide === "stalkers"
      ? "assets/images/stalkers.webp"
      : "assets/images/bandits.png";

  randomCell.appendChild(compImg);
  victoryAlert();
}

function checkVictory() {
  const values = [...playCells].map((cell) => {
    const img = cell.querySelector("img");
    if (!img) return null;
    return img.src.includes("stalkers") ? "S" : "B";
  });
  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (values[a] && values[a] === values[b] && values[a] === values[c]) {
      return values[a];
    }
  }

  return null;
}

function victoryAlert() {
  const winner = checkVictory();

  if (winner === "S") {
    showModal("Stalkers win!", 100000);
    game = false;
    playFinalSound();
    return;
  } else if (winner === "B") {
    showModal("Bandits win!", 100000);
    game = false;
    playFinalSound();
    return;
  }

  const isDraw = [...playCells].every((cell) => cell.querySelector("img"));

  if (!winner && isDraw) {
    showModal("Tie :(", 100000);
    game = false;
    playFinalSound();
    return;
  }
}
