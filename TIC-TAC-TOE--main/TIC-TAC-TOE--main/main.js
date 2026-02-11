// ===============================
// Tic-Tac-Toe Game Logic (Modern ES6)
// ===============================

// DOM Elements
const statusDisplay = document.querySelector('.game__status');
const gameBoard = document.querySelector('.game__container');
const restartButton = document.querySelector('.game__restart');
const confettiCanvas = document.getElementById('confetti');

// Game State
let gameActive = true;
let currentPlayer = "X";
let gameState = Array(9).fill("");

// Messages
const messages = {
    win: (player) => `🎉 <span style='color:#ff7eb3'>Player ${player}</span> wins! <span style='font-size:2rem'>🏆</span>`,
    draw: () => `🤝 <span style='color:#3ec9d6'>It's a draw!</span> <span style='font-size:2rem'>😇</span>`,
    turn: (player) => `<span style='color:#3ec9d6'>${player}</span>'s turn <span style='font-size:1.5rem'>✨</span>`
};

// Winning Conditions
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize
statusDisplay.innerHTML = messages.turn(currentPlayer);

// ===============================
// Game Functions
// ===============================

const handleCellPlayed = (cell, index) => {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.transform = 'scale(1.2)';
    setTimeout(() => cell.style.transform = '', 200);
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = messages.turn(currentPlayer);
};

const checkWinner = () => {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            return condition;
        }
    }
    return null;
};

const handleResultValidation = () => {
    const winCondition = checkWinner();
    if (winCondition) {
        statusDisplay.innerHTML = messages.win(currentPlayer);
        gameActive = false;
        // Animate winning cells
        winCondition.forEach(idx => {
            const cell = document.querySelector(`.cell[data-cell-index='${idx}']`);
            cell.classList.add('cell--win');
        });
        launchConfetti();
        return;
    }
    if (!gameState.includes("")) {
        statusDisplay.innerHTML = messages.draw();
        gameActive = false;
        return;
    }
    handlePlayerChange();
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const index = parseInt(clickedCell.dataset.cellIndex);

    if (!clickedCell.classList.contains('cell') || gameState[index] || !gameActive) return;

    handleCellPlayed(clickedCell, index);
    handleResultValidation();
};

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill("");
    statusDisplay.innerHTML = messages.turn(currentPlayer);
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('cell--win');
    });
    clearConfetti();
};
// ===============================
// Confetti Animation
// ===============================
function launchConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            r: Math.random() * 8 + 4,
            d: Math.random() * 120,
            color: `hsl(${Math.random()*360},80%,70%)`,
            tilt: Math.random() * 10 - 5
        });
    }
    let angle = 0;
    function draw() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        update();
    }
    function update() {
        angle += 0.01;
        for (let p of particles) {
            p.y += Math.cos(angle + p.d) + 2 + p.r/2;
            p.x += Math.sin(angle) * 2;
            if (p.y > confettiCanvas.height) {
                p.x = Math.random() * confettiCanvas.width;
                p.y = -10;
            }
        }
    }
    let confettiInterval = setInterval(draw, 16);
    setTimeout(() => {
        clearInterval(confettiInterval);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }, 2200);
}

function clearConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ===============================
// Event Listeners
// ===============================

gameBoard.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', handleRestartGame);

// Theme toggle logic

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    if (themeToggle) {
        themeToggle.title = "Toggle dark theme";
        themeToggle.addEventListener('click', () => {
                    console.log('Moon button clicked: toggling theme');
                    document.body.classList.add('theme-animate');
                    document.body.classList.toggle('dark-theme');
                    document.querySelectorAll('.game, .cell, .game__title, .game__restart, .game__status').forEach(el => {
                        el.classList.toggle('dark-theme');
                    });
                    setTimeout(() => {
                        document.body.classList.remove('theme-animate');
                    }, 700);
        });
    }
});
