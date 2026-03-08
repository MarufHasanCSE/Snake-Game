const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-val");
const startBtn = document.getElementById("start-btn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let dx = 0;
let dy = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let gameInterval = null;

function drawGame() {
    updateSnakePosition();
    
    if (checkGameOver()) {
        clearInterval(gameInterval);
        alert("Game Over! Score: " + score);
        location.reload();
        return;
    }

    checkFoodCollision();
    drawBackground();
    drawFood();
    drawSnake();
}

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#00ff00";
    snake.forEach(part => ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2));
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function updateSnakePosition() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreElement.textContent = score;
        snake.push({}); 
        placeFood();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkGameOver() {
    if (dx === 0 && dy === 0) return false;

    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x >= tileCount;
    const hitTop = snake[0].y < 0;
    const hitBottom = snake[0].y >= tileCount;

    let hitSelf = false;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            hitSelf = true;
        }
    }

    return hitLeft || hitRight || hitTop || hitBottom || hitSelf;
}

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp": if (dy !== 1) { dx = 0; dy = -1; } break;
        case "ArrowDown": if (dy !== -1) { dx = 0; dy = 1; } break;
        case "ArrowLeft": if (dx !== 1) { dx = -1; dy = 0; } break;
        case "ArrowRight": if (dx !== -1) { dx = 1; dy = 0; } break;
    }
});

startBtn.addEventListener("click", () => {
    if (!gameInterval) {
        gameInterval = setInterval(drawGame, 100);
        startBtn.style.display = "none";
    }
});