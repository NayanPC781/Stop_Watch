        // DOM elements
        const minutesDisplay = document.getElementById('minutes');
        const secondsDisplay = document.getElementById('seconds');
        const millisecondsDisplay = document.getElementById('milliseconds');
        const startStopButton = document.getElementById('startStop');
        const lapButton = document.getElementById('lap');
        const resetButton = document.getElementById('reset');
        const lapsContainer = document.getElementById('lapsContainer');
        
        // Variables
        let startTime;
        let elapsedTime = 0;
        let timerInterval;
        let isRunning = false;
        let lapCount = 0;
        let lastLapTime = 0;
        
        // Format time to display
        function formatTime(timeInMilliseconds) {
            const totalMilliseconds = timeInMilliseconds % 1000;
            const totalSeconds = Math.floor(timeInMilliseconds / 1000);
            const displaySeconds = totalSeconds % 60;
            const displayMinutes = Math.floor(totalSeconds / 60);
            
            return {
                minutes: displayMinutes.toString().padStart(2, '0'),
                seconds: displaySeconds.toString().padStart(2, '0'),
                milliseconds: Math.floor(totalMilliseconds / 10).toString().padStart(2, '0')
            };
        }
        
        // Update display
        function updateDisplay(timeObject) {
            minutesDisplay.textContent = timeObject.minutes;
            secondsDisplay.textContent = timeObject.seconds;
            millisecondsDisplay.textContent = timeObject.milliseconds;
        }
        
        // Start/Stop functionality
        function toggleTimer() {
            if (!isRunning) {
                // Start the timer
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateTimer, 10);
                startStopButton.textContent = 'Stop';
                startStopButton.classList.add('stop');
                lapButton.disabled = false;
            } else {
                // Stop the timer
                clearInterval(timerInterval);
                startStopButton.textContent = 'Start';
                startStopButton.classList.remove('stop');
            }
            isRunning = !isRunning;
        }
        
        // Update timer
        function updateTimer() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;
            updateDisplay(formatTime(elapsedTime));
        }
        
        // Record lap
        function recordLap() {
            if (!isRunning) return;
            
            lapCount++;
            const lapTime = elapsedTime;
            const lapDiff = lapTime - lastLapTime;
            lastLapTime = lapTime;
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${lapCount}`;
            
            const lapTimeDisplay = document.createElement('span');
            lapTimeDisplay.className = 'lap-time';
            
            // Format full lap time
            const formattedLapTime = formatTime(lapTime);
            
            // Format lap difference (if not the first lap)
            let lapDiffDisplay = '';
            if (lapCount > 1) {
                const formattedDiff = formatTime(lapDiff);
                lapDiffDisplay = ` (+${formattedDiff.minutes}:${formattedDiff.seconds}.${formattedDiff.milliseconds})`;
            }
            
            lapTimeDisplay.textContent = `${formattedLapTime.minutes}:${formattedLapTime.seconds}.${formattedLapTime.milliseconds}${lapDiffDisplay}`;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTimeDisplay);
            
            // Add lap to the top of the list
            lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
        }
        
        // Reset timer
        function resetTimer() {
            clearInterval(timerInterval);
            elapsedTime = 0;
            lapCount = 0;
            lastLapTime = 0;
            isRunning = false;
            updateDisplay(formatTime(0));
            startStopButton.textContent = 'Start';
            startStopButton.classList.remove('stop');
            lapButton.disabled = true;
            lapsContainer.innerHTML = '';
        }
        
        // Event listeners
        startStopButton.addEventListener('click', toggleTimer);
        lapButton.addEventListener('click', recordLap);
        resetButton.addEventListener('click', resetTimer);
        
        // Initialize display
        updateDisplay(formatTime(0));