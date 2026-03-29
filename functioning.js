document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startBtn');
    const stopButton = document.getElementById('stopBtn');
    const resetButton = document.getElementById('resetBtn');

    let seconds = 0;
    let timerInterval = null;

    function updateDisplay() {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        timerDisplay.textContent = 
            `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        updateDisplay();
    }

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    resetButton.addEventListener('click', resetTimer);
});
