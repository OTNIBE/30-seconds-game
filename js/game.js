// Game state
let words = [];
let currentSet = 'A';
let setA = [];
let setB = [];
let score = 0;
let timer = null;
let timeLeft = 30;

// DOM elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const flipBtn = document.getElementById('flip-btn');
const correctBtn = document.getElementById('correct-btn');
const passBtn = document.getElementById('pass-btn');
const newRoundBtn = document.getElementById('new-round-btn');

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const scoreScreen = document.getElementById('score-screen');

const wordDisplay = document.getElementById('word-display');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');

//Load words from JSON
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        const data = await response.json();
        words = data.words;
        console.log(`Loaded ${words.length} words`);
    } catch (error) {
        console.error('Error loading words:', error);
        wordDisplay.innerHTML = '<p>Error loading words. Check console.</p>';
    }
}

// Get random unique words
function getRandomWords(count) {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Display current word set
function displayWords() {
    const displaySet = currentSet === 'A' ? setA : setB;
    wordDisplay.innerHTML = displaySet.map(word => `<p>${word}</p>`).join('');
}

// Start new round
function startRound() {
    if (words.length < 10) {
        alert('Need at least 10 words in your list!');
        return;
    }

    // Generate two unique sets of 5 words
    const roundWords = getRandomWords(10);
    setA = roundWords.slice(0, 5);
    setB = roundWords.slice(5, 10);
    currentSet = 'A';
    score = 0;
    timeLeft = 30;

    // Switch screens
    setupScreen.style.display = 'none';
    scoreScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // Display and start timer
    displayWords();
    updateTimer();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endRound();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff5252';
    } else {
        timerDisplay.style.color = '#ffd700';
    }
}

// Flip between word sets
function flipWords() {
    currentSet = currentSet === 'A' ? 'B' : 'A';
    displayWords();
}

// Score a correct guess
function scoreCorrect() {
    score++;
    // Move to next word in current set (simple implementation)
    displayWords();
}

// Pass on a word
function scorePass() {
    displayWords();
}

// End round
function endRound() {
    clearInterval(timer);
    gameScreen.style.display = 'none';
    scoreScreen.style.display = 'block';
    finalScoreDisplay.textContent = score;
}

// Reset to setup
function resetGame() {
    scoreScreen.style.display = 'none';
    setupScreen.style.display = 'block';
}

// Event listeners
startBtn.addEventListener('click', startRound);
stopBtn.addEventListener('click', endRound);
flipBtn.addEventListener('click', flipWords);
correctBtn.addEventListener('click', scoreCorrect);
passBtn.addEventListener('click', scorePass);
newRoundBtn.addEventListener('click', resetGame);

// Initialize
loadWords();