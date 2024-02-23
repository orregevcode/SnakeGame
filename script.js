// Get reference to the game board element from the DOM
const board = document.getElementById("game-board");

// Define the size of the grid
const gridSize = 20;

// Initialize the snake with its starting position
let snake = [{ x: 10, y: 10 }];

// Initialize the food position
let food = generateFood();

// Initialize the direction of the snake's movement
let direction = "right";

// Declare variable to hold the game interval
let gameInterval;

// Set the delay between each game loop iteration
let gameSpeedDelay = 200;

// Track whether the game has started or not
let gameStarted = false;

// Get reference to game instruction and logo elements from the DOM
const gameInstruction = document.getElementById("startGame");
const gameLogo = document.getElementById("logo");

// Get reference to score and high score elements from the DOM
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

// Initialize the high score
let highScore = 0;

// Function to draw the game state
function draw() {
  // Clear the game board
  board.innerHTML = "";

  // Draw the snake on the game board
  drawSnake();

  // Draw the food on the game board
  drawFood();

  // Update the score displayed on the screen
  updateScore();
}

// Function to draw the snake on the game board
function drawSnake() {
  snake.forEach((segment) => {
    // Create HTML element to represent each segment of the snake
    const snakeElement = createGameElement("div", "snake");

    // Set the position of the snake segment on the game board
    setPosition(snakeElement, segment);

    // Append the snake segment to the game board
    board.appendChild(snakeElement);
  });
}

// Helper function to create a new HTML element
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Function to set the position of an element on the game board
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Function to draw the food on the game board
function drawFood() {
  // Create HTML element to represent the food
  const foodElement = createGameElement("div", "food");

  // Set the position of the food on the game board
  setPosition(foodElement, food);

  // Append the food to the game board
  board.appendChild(foodElement);
}

// Function to generate random coordinates for the food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Function to move the snake
function move() {
  // Create a copy of the head of the snake
  const head = { ...snake[0] };

  // Update the position of the head based on the current direction
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    default:
      break;
  }

  // Add the new head to the beginning of the snake array
  snake.unshift(head);

  // Check if the snake has collided with the food
  if (head.x === food.x && head.y === food.y) {
    // Generate new food position
    food = generateFood();

    // Increase game speed
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    // Remove the tail of the snake
    snake.pop();
  }
}

// Function to start the game
function startGame() {
  // Set gameStarted flag to true
  gameStarted = true;

  // Hide game instruction and logo
  gameInstruction.style.display = "none";
  gameLogo.style.display = "none";

  // Start the game loop
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Event listener for keyboard input
function handleKeyPress(event) {
  if (!gameStarted && (event.code === "Space" || event.key === "")) {
    // Start the game if it hasn't started yet and Space key is pressed
    startGame();
  } else {
    // Change direction based on arrow key input
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

// Function to check for collisions
function checkCollision() {
  const head = snake[0];

  // Check for collision with game boundaries
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    // If collision detected, reset the game
    resetGame();
  }

  // Check for collision with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Function to reset the game
function resetGame() {
  // Update the high score
  updateHighScore();

  // Stop the game
  stopGame();

  // Reset snake position and direction
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;

  // Update the score
  updateScore();
}

// Function to update the score displayed on the screen
function updateScore() {
  const currentScore = snake.length - 1;
  scoreElement.textContent = currentScore.toString().padStart(3, "0");
}

// Function to stop the game
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  gameInstruction.style.display = "block";
  gameLogo.style.display = "block";
}

// Function to update the high score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  highScoreElement.textContent = highScore.toString().padStart(3, "0");
}

// Event listener for keyboard input
document.addEventListener("keydown", handleKeyPress);
