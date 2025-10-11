const container = document.getElementById("game-container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const topScoreDisplay = document.getElementById("top-score");
const overlay = document.getElementById("overlay");
const finalScore = document.getElementById("final-score");
const finalTop = document.getElementById("final-top");
const restartBtn = document.getElementById("restart");

let score = 0;
let missed = 0;
let gameRunning = true;
let basketX = 0;
let topScore = parseInt(localStorage.getItem("topScore") || "0");

topScoreDisplay.textContent = topScore;

// Object types
const objects = [
  { emoji: "🍎", points: 1 },
  { emoji: "🍋", points: 2 },
  { emoji: "💎", points: 5 },
  { emoji: "🪙", points: 3 },
];

// Initialize basket
function setBasketPosition() {
  basketX = container.clientWidth / 2 - basket.offsetWidth / 2;
  basket.style.left = basketX + "px";
}
setBasketPosition();
window.addEventListener("resize", setBasketPosition);

// Arrow key movement
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  const step = container.clientWidth * 0.05;
  if (e.key === "ArrowLeft") basketX = Math.max(0, basketX - step);
  if (e.key === "ArrowRight") basketX = Math.min(container.clientWidth - basket.offsetWidth, basketX + step);
  basket.style.left = basketX + "px";
});

// Mouse movement
container.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  const rect = container.getBoundingClientRect();
  let x = e.clientX - rect.left - basket.offsetWidth / 2;
  x = Math.max(0, Math.min(container.clientWidth - basket.offsetWidth, x));
  basketX = x;
  basket.style.left = basketX + "px";
});

// Create falling object
function createObject() {
  if (!gameRunning) return;
  const objData = objects[Math.floor(Math.random() * objects.length)];
  const obj = document.createElement("div");
  obj.classList.add("object");
  obj.textContent = objData.emoji;
  obj.dataset.points = objData.points;
  obj.style.left = Math.random() * (container.clientWidth - 30) + "px";
  obj.style.top = "0px";
  container.appendChild(obj);
  fall(obj);
}

// Falling logic
function fall(obj) {
  let topPos = 0;
  const speed = 2 + Math.random() * 2;
  const interval = setInterval(() => {
    if (!gameRunning) { clearInterval(interval); return; }
    topPos += speed;
    obj.style.top = topPos + "px";

    const basketRect = basket.getBoundingClientRect();
    const objRect = obj.getBoundingClientRect();

    // Collision
    if (
      objRect.bottom >= basketRect.top &&
      objRect.left < basketRect.right &&
      objRect.right > basketRect.left
    ) {
      score += parseInt(obj.dataset.points);
      scoreDisplay.textContent = score;
      if (score > topScore) {
        topScore = score;
        topScoreDisplay.textContent = topScore;
        localStorage.setItem("topScore", topScore);
      }
      obj.remove();
      clearInterval(interval);
    }

    // Missed
    if (topPos > container.clientHeight - obj.offsetHeight) {
      missed++;
      missedDisplay.textContent = missed;
      obj.remove();
      clearInterval(interval);
      if (missed >= 5) endGame();
    }
  }, 15);
}

// End game
function endGame() {
  gameRunning = false;
  finalScore.textContent = score;
  finalTop.textContent = topScore;
  overlay.classList.remove("hidden");
}

// Restart game
restartBtn.addEventListener("click", () => {
  document.querySelectorAll(".object").forEach(o => o.remove());
  score = 0;
  missed = 0;
  basketX = container.clientWidth / 2 - basket.offsetWidth / 2;
  basket.style.left = basketX + "px";
  scoreDisplay.textContent = 0;
  missedDisplay.textContent = 0;
  gameRunning = true;
  overlay.classList.add("hidden");
});

setInterval(createObject, 900);
