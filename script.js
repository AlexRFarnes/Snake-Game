const target = document.querySelector('h1');
const grid = document.querySelector('.grid');
const btn = document.querySelector('#start');
const scoreEl = document.querySelector('[data-score]');
let squares = [];
let snake = [2, 1, 0];
let direction = 1;
const width = 20;
let appleIndex = 0;
let intervalTime = 700;
let speed = 0.9;
let score = 0;
let timerId;

function startGame() {
  // Remove class snake and apple from the grid
  snake.forEach(index => squares[index].classList.remove('snake'));
  squares[appleIndex].classList.remove('apple');

  // Reset variables to initial state
  snake = [2, 1, 0];
  direction = 1;
  score = 0;
  scoreEl.textContent = score;
  intervalTime = 700;

  createSnake();
  generateApple();
  clearInterval(timerId);
  timerId = setInterval(move, intervalTime);
}

function createGrid() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    squares.push(square);
    grid.appendChild(square);
  }
}

function createSnake() {
  snake.forEach(index => {
    squares[index].classList.add('snake');
  });
}

function generateApple() {
  do {
    appleIndex = Math.floor(Math.random() * width * width);
  } while (squares[appleIndex].classList.contains('snake'));
  squares[appleIndex].classList.add('apple');
}

function move() {
  if (
    // Check if the snake has hit the left wall
    (snake[0] % width === 0 && direction === -1) ||
    // Check if the snake has hit the right wall
    (snake[0] % width === width - 1 && direction === 1) ||
    // Check if the snake has hit the top wall
    (snake[0] - width < 0 && direction === -width) ||
    // Check if the snake has hit the bottom wall
    (snake[0] + width >= width * width && direction === width) ||
    // Check if the snake has hit itself
    squares[snake[0] + direction].classList.contains('snake')
  ) {
    clearInterval(timerId);
    return;
  }
  // Remove the tail of the snake array and remove the class from the div
  const tail = snake.pop();
  squares[tail].classList.remove('snake');
  // Add to the head of the snake according to the moving direction
  const newHead = snake[0] + direction;
  snake.unshift(newHead);

  // snake head eating the apple
  if (squares[newHead].classList.contains('apple')) {
    // Remove the apple class
    squares[newHead].classList.remove('apple');
    // Grow the snake by adding class of snake to a new div
    squares[tail].classList.add('snake');
    // Push the previously pop tail value into the snake array
    snake.push(tail);
    // Generate a new apple
    generateApple();
    // Add one to the score
    score++;
    scoreEl.textContent = score;
    // Speed up the snake
    clearInterval(timerId);
    intervalTime = intervalTime <= 50 ? 50 : intervalTime * speed;

    timerId = setInterval(move, intervalTime);
  }

  // Add the class of snake to the new head of the snake
  squares[newHead].classList.add('snake');
}

function control({ code }) {
  if (code === 'ArrowLeft' && direction !== 1) {
    direction = -1;
  } else if (code === 'ArrowRight' && direction !== -1) {
    direction = 1;
  } else if (code === 'ArrowUp' && direction !== width) {
    direction = -width;
  } else if (code === 'ArrowDown' && direction !== -width) {
    direction = width;
  }
}

document.addEventListener('keydown', e => {
  control(e);
  0;
});

btn.addEventListener('click', startGame);

createGrid();

const flickerLetter = letter =>
  `<span style="animation: text-flicker-in-glow ${
    Math.random() * 4
  }s linear both ">${letter}</span>`;
const colorLetter = letter =>
  `<span style="color: hsla(${
    Math.random() * 360
  }, 100%, 60%, 1);">${letter}</span>`;
const flickerAndColorText = text =>
  text.split('').map(flickerLetter).map(colorLetter).join('');
const neonGlory = target =>
  (target.innerHTML = flickerAndColorText(target.textContent));

neonGlory(target);
setInterval(() => {
  neonGlory(target);
}, 10000);
target.onclick = ({ target }) => neonGlory(target);
