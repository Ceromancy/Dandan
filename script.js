// Timers in seconds
let workTimeSeconds = 25 * 60;
let breakTimeSeconds = 5 * 60;
let timeLeft = workTimeSeconds; 

let timerId = null; //The dog is under the table
let isWorkTime = true; // Tracks if we are in Work or Break mode

// Session Tracking Variables
let focusBlocksCompleted = parseInt(localStorage.getItem('focusCount')) || 0;
let breaksCompleted = parseInt(localStorage.getItem('breakCount')) || 0;

// Get Timer UI Elements
const alarmSound = document.getElementById('alarm-sound');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

// Get Graph UI Elements
const focusBar = document.getElementById('focus-bar');
const breakBar = document.getElementById('break-bar');
const focusCountLabel = document.getElementById('focus-count');
const breakCountLabel = document.getElementById('break-count');
const summaryText = document.getElementById('progress-summary');

function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    minutesDisplay.textContent = mins < 10 ? '0' + mins : mins;
    secondsDisplay.textContent = secs < 10 ? '0' + secs : secs;
}

/**
 * Updates the visual graph and text summary.
 */
function updateGraph() {
    // Update text and labels
    focusCountLabel.textContent = focusBlocksCompleted;
    breakCountLabel.textContent = breaksCompleted;
    summaryText.textContent = `Today's progress: ${focusBlocksCompleted} focus, ${breaksCompleted} breaks`;

    // Save the new counts to the browser's "filing cabinet"
    localStorage.setItem('focusCount', focusBlocksCompleted);
    localStorage.setItem('breakCount', breaksCompleted);

    // Update bar heights
    const pixelsPerSession = 25;
    const focusHeight = Math.min(10 + (focusBlocksCompleted * pixelsPerSession), 150);
    const breakHeight = Math.min(10 + (breaksCompleted * pixelsPerSession), 150);

    focusBar.style.height = `${focusHeight}px`;
    breakBar.style.height = `${breakHeight}px`;
}

function startTimer() {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;

            // PLAY THE SOUND HERE
            alarmSound.play().catch(error => {
                console.log("Audio play failed. Browsers require a user click first.", error);
            });

            if (isWorkTime) {
                focusBlocksCompleted++;
            } else {
                breaksCompleted++;
            }
            
            updateGraph();
            
            // The alert pauses the script, so the sound plays 
            // just as the notification appears.
            alert(isWorkTime ? "Work over! Break time." : "Break over! Back to work.");
            
            switchMode();
            startTimer(); 
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    statusDisplay.style.fontStyle = "italic"; // Visual feedback of pause
}

function resetTimer() {
    pauseTimer();
    isWorkTime = true;
    timeLeft = 25 * 60;
    
    // Reset variables AND clear storage
    focusBlocksCompleted = 0;
    breaksCompleted = 0;
    localStorage.removeItem('focusCount');
    localStorage.removeItem('breakCount');
    
    updateGraph();
    updateDisplay();
}

/**
 * Toggles between work and break. Setting the time and UI.
 */
function switchMode() {
    isWorkTime = !isWorkTime; 
    
    // Select the body element to change classes
    const body = document.body;

    if (isWorkTime) {
        timeLeft = workTimeSeconds;
        statusDisplay.textContent = "Time to Work!";
        statusDisplay.style.color = "#e74c3c";
        
        // Update Background Class
        body.classList.remove('break-bg');
        body.classList.add('work-bg');
    } else {
        timeLeft = breakTimeSeconds;
        statusDisplay.textContent = "Take a Break!";
        statusDisplay.style.color = "#2ecc71";
        
        // Update Background Class
        body.classList.remove('work-bg');
        body.classList.add('break-bg');
    }
    updateDisplay();
}

// Setup initial state
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial initialization
updateDisplay();
updateGraph();

document.body.classList.add('work-bg');