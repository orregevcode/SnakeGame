const board = document.getElementById("game-board");
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
const gameInstruction = document.getElementById("startGame");
const gameLogo = document.getElementById("logo");
const scroe = document.getElementById("score");

const highScoreElement = document.getElementById("highScore");
let highScore = 0; // Initialize highScore variable

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  upadteScroe();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

drawSnake();
drawFood();

//moving the snake
function move() {
  const head = { ...snake[0] }; // Copy of the original object

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++; // Increment y to move the snake down
      break;
    case "left":
      head.x--; // Decrement x to move the snake left
      break;
    default:
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval); // Clear the previous interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// setInterval(() => {
//   move();
//   draw();
// }, 200);

//start game function

function startGame() {
  gameStarted = true;
  gameInstruction.style.display = "none";
  gameLogo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//evemt key press event listener
function handleKeyPress(event) {
  if (!gameStarted && (event.code === "Space" || event.key === "")) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      default:
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    restGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      restGame();
    }
  }
}

function restGame() {
  upadteHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  upadteScroe();
}

function upadteScroe() {
  const currentScore = snake.length - 1;
  scroe.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  gameInstruction.style.display = "block";
  gameLogo.style.display = "block";
}

function upadteHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  highScoreElement.textContent = highScore.toString().padStart(3, "0");
}
