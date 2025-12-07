let score = 0;
let gameMode = "original";
let playerShow, houseShow, gestures;
const scoreP = document.getElementById("score");
const gameDiv = document.getElementById("game");
const boardDiv = document.querySelector("div.board");
const resultDiv = document.querySelector("div.result");
const allGestures = [
  { id: 1, name: "rock", wins: [3, 5], src: "./images/icon-rock.svg" },
  { id: 2, name: "paper", wins: [1, 4], src: "./images/icon-paper.svg" },
  { id: 3, name: "scissors", wins: [2, 5], src: "./images/icon-scissors.svg" },
  { id: 4, name: "spock", wins: [1, 3], src: "./images/icon-spock.svg" },
  { id: 5, name: "lizard", wins: [2, 4], src: "./images/icon-lizard.svg" },
];

setGameMode(gameMode);
handleModal();
renderScore(score);
attachHandlePlayerShow();
attachHandlePlayAgain();
attachHandleModeButton();
console.log(gestures);

function setGameMode(gameMode) {
  gameDiv.setAttribute("data-mode", gameMode);
  gestures = gameMode === "bonus" ? allGestures : allGestures.slice(0, 3);
}
function attachHandlePlayerShow() {
  document
    .querySelectorAll("div.board button.gesture-button")
    .forEach((buttonElement) =>
      buttonElement.addEventListener("click", handlePlayerShow)
    );
}
function attachHandlePlayAgain() {
  document
    .querySelector("div.result__report button")
    .addEventListener("click", handlePlayAgain);
}
function attachHandleModeButton() {
  document
    .querySelector("button.mode-button")
    .addEventListener("click", (e) => {
      const currentMode = gameDiv.getAttribute("data-mode");
      const nextMode = currentMode === "original" ? "bonus" : "original";
      e.currentTarget.textContent = `${currentMode.toUpperCase()} MODE`;
      setGameMode(nextMode);
    });
}
function renderShow(side, gesture, winner) {
  const showDiv =
    side === "player"
      ? document.querySelector("div.result__show.player")
      : document.querySelector("div.result__show.house");
  showDiv.querySelector("p.visually-hidden").textContent = gesture.name;
  showDiv.querySelector("button").setAttribute("data-gesture", gesture.name);
  showDiv.querySelector("button").setAttribute("data-win", side === winner);
  showDiv.querySelector("img").setAttribute("src", gesture.src);
}
function renderResult() {
  boardDiv.setAttribute("hidden", "");
  resultDiv.removeAttribute("hidden");
  winner = playerShow.wins.includes(houseShow.id)
    ? "player"
    : houseShow.wins.includes(playerShow.id)
    ? "house"
    : "draw";
  renderShow("player", playerShow, winner);
  renderShow("house", houseShow, winner);
  document.querySelector("div.result__report h2").textContent =
    winner === "draw" ? "DRAW" : `YOU ${winner === "player" ? "WIN" : "LOSE"}`;
  if (winner === "player") {
    score++;
  } else if (winner === "house") {
    score--;
  }
  scoreP.textContent = score;
}
function renderScore(score) {
  document.getElementById("score").textContent = score;
}
function renderBoard() {
  boardDiv.removeAttribute("hidden");
  resultDiv.setAttribute("hidden", "");
  playerShow = undefined;
  houseShow = undefined;
}
function randomGesture(gestures) {
  const randomId = Math.floor(Math.random() * gestures.length) + 1;
  return gestures.filter((gesture) => gesture.id === randomId)[0];
}
function handlePlayerShow(e) {
  playerShow = gestures.filter(
    (gesture) => gesture.name === e.currentTarget.getAttribute("data-gesture")
  )[0];
  houseShow = randomGesture(gestures);
  renderResult();
}
function handlePlayAgain() {
  renderBoard();
}
function handleModal() {
  const dialogElement = document.getElementById("rules-dialog");
  document
    .querySelector("button.rules-button")
    .addEventListener("click", () => {
      dialogElement.showModal();
    });
  dialogElement.addEventListener("click", (e) => {
    console.log(e.target);

    if (e.target === e.currentTarget) {
      e.currentTarget.close();
    }
  });
}