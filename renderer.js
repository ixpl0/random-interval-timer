document.addEventListener('DOMContentLoaded', () => {
  const { ipcRenderer } = require('electron');
  const { playBeep, initAudio } = require('./sound');

  const ACTIVE_TIMER_CLASS = 'active-timer';
  const MAIN_BUTTON_TEXT = 'GO!';

  const mainButton = document.querySelector('.main-button');
  const closeButton = document.querySelector('.close-button');
  const settingsButton = document.querySelector('.settings-button');
  const settingsView = document.querySelector('.settings-view');
  const minimizeButton = document.querySelector('.minimize-button');

  const minHoursInput = document.querySelector('.min-hours');
  const minMinutesInput = document.querySelector('.min-minutes');
  const minSecondsInput = document.querySelector('.min-seconds');
  const maxHoursInput = document.querySelector('.max-hours');
  const maxMinutesInput = document.querySelector('.max-minutes');
  const maxSecondsInput = document.querySelector('.max-seconds');

  let remaining = 0;
  let timerStopper = null;
  let isRunning = false;
  let isCountingDown = false;
  let isSettingsMode = false;
  let originalConfig = null;
  let countdownTimeouts = [];

  let timerConfig = {
    minSeconds: 240,
    maxSeconds: 285,
  };

  const getRandomInterval = () => {
    return Math.floor(timerConfig.minSeconds + Math.random() * (timerConfig.maxSeconds - timerConfig.minSeconds + 1));
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else {
      return `${m}:${String(s).padStart(2, '0')}`;
    }
  };

  const updateOverlay = () => {
    const value = remaining > 0 ? formatTime(remaining) : '';

    ipcRenderer.send('update-timer-overlay', value);
  };

  const playBeepWithOutline = async () => {
    mainButton.style.outline = '3px solid #e74c3c';
    await playBeep();
    mainButton.style.outline = '';
  };

  const tick = async () => {
    remaining--;
    updateOverlay();

    if (remaining <= 0) {
      await playBeepWithOutline();
      startNewInterval();
    } else {
      mainButton.textContent = formatTime(remaining);

      if (mainButton.style.outline) {
        mainButton.style.outline = '';
      }

      if (mainButton.style.outlineOffset) {
        mainButton.style.outlineOffset = '';
      }
    }
  };

  const startNewInterval = () => {
    remaining = getRandomInterval();
    mainButton.textContent = formatTime(remaining);
    mainButton.classList.add(ACTIVE_TIMER_CLASS);
    updateOverlay();
  };

  const stop = () => {
    if (timerStopper) {
      timerStopper();
      timerStopper = null;
    }

    countdownTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    countdownTimeouts = [];

    isRunning = false;
    isCountingDown = false;
    mainButton.textContent = MAIN_BUTTON_TEXT;
    mainButton.classList.remove(ACTIVE_TIMER_CLASS);

    ipcRenderer.send('update-timer-overlay', '');
  };

  const startAccurateTimer = (callback) => {
    const start = Date.now();
    let stopped = false;
    let count = 0;

    const tick = () => {
      if (stopped) {
        return;
      }

      count += 1;
      callback();

      const expected = start + count * 1000;
      const drift = Date.now() - expected;

      setTimeout(tick, Math.max(0, 1000 - drift));
    };

    const timeoutId = setTimeout(tick, 1000);

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  };

  const start = async () => {
    if (isRunning || isCountingDown) {
      stop();
      return;
    }

    isRunning = true;
    isCountingDown = true;

    for (let i = 3; i > 0; i--) {
      if (!isRunning || !isCountingDown) {
        return;
      }

      mainButton.textContent = String(i);
      playBeepWithOutline();

      await new Promise((resolve) => {
        const timeoutId = setTimeout(resolve, 1000);
        countdownTimeouts.push(timeoutId);
      });

      if (!isRunning || !isCountingDown) {
        return;
      }
    }

    if (!isRunning || !isCountingDown) {
      return;
    }

    isCountingDown = false;
    startNewInterval();
    timerStopper = startAccurateTimer(tick);
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('timerConfig');

      if (saved) {
        timerConfig = JSON.parse(saved);
      }
    } catch (e) {
      timerConfig = { minSeconds: 240, maxSeconds: 285 };
    }
  };

  const saveSettings = () => {
    localStorage.setItem('timerConfig', JSON.stringify(timerConfig));
  };

  const timeToSeconds = (hours, minutes, seconds) => hours * 3600 + minutes * 60 + seconds;

  const secondsToTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  };

  const hideSettingsView = () => {
    isSettingsMode = false;
    settingsView.style.display = 'none';
    mainButton.style.display = 'block';
    originalConfig = null;
    settingsButton.title = 'Settings';
    closeButton.title = 'Close';
  };

  const cancelSettings = () => {
    if (originalConfig) {
      timerConfig = originalConfig;
    }
    hideSettingsView();
  };

  const updateModalInputs = () => {
    const minTime = secondsToTime(timerConfig.minSeconds);
    const maxTime = secondsToTime(timerConfig.maxSeconds);

    minHoursInput.value = minTime.hours;
    minMinutesInput.value = minTime.minutes;
    minSecondsInput.value = minTime.seconds;
    maxHoursInput.value = maxTime.hours;
    maxMinutesInput.value = maxTime.minutes;
    maxSecondsInput.value = maxTime.seconds;
  };

  const showSettingsView = () => {
    isSettingsMode = true;
    originalConfig = structuredClone(timerConfig);
    updateModalInputs();
    mainButton.style.display = 'none';
    settingsView.style.display = 'flex';
    settingsButton.title = 'Apply';
    closeButton.title = 'Cancel';
  };

  const validateAndSaveSettings = () => {
    const minHours = Number(minHoursInput.value);
    const minMinutes = Number(minMinutesInput.value);
    const minSecondsVal = Number(minSecondsInput.value);
    const maxHours = Number(maxHoursInput.value);
    const maxMinutes = Number(maxMinutesInput.value);
    const maxSecondsVal = Number(maxSecondsInput.value);

    const newMinSeconds = timeToSeconds(minHours, minMinutes, minSecondsVal);
    const newMaxSeconds = timeToSeconds(maxHours, maxMinutes, maxSecondsVal);

    if (newMinSeconds <= 0) {
      return false;
    }

    if (newMaxSeconds < newMinSeconds) {
      return false;
    }

    timerConfig.minSeconds = newMinSeconds;
    timerConfig.maxSeconds = newMaxSeconds;
    saveSettings();
    hideSettingsView();

    return true;
  };

  mainButton.addEventListener('click', () => {
    initAudio();
    start();
  });

  closeButton.addEventListener('click', () => {
    if (isSettingsMode) {
      cancelSettings();
    } else {
      if (isRunning) {
        stop();
      }

      ipcRenderer.send('close-window');
    }
  });

  minimizeButton.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
  });

  window.onerror = (msg, url, line, col, error) => {
    try {
      ipcRenderer.send('renderer-error', {
        msg,
        url,
        line,
        col,
        error: error ? error.stack : null,
      });
    } catch (e) {
    }
  };

  settingsButton.addEventListener('click', (e) => {
    e.stopPropagation();

    if (isSettingsMode) {
      if (validateAndSaveSettings()) {
        hideSettingsView();
      }
    } else {
      showSettingsView();
    }
  });

  document.querySelectorAll('.time-mini-input')
    .forEach((input) => {
      input.addEventListener('input', (e) => {
        const min = Number(e.target.min || 0);
        const max = Number(e.target.max || 59);
        let value = Number(e.target.value || 0);

        if (value < min) {
          e.target.value = min;
        }

        if (value > max) {
          e.target.value = max;
        }

        if (isNaN(value)) {
          e.target.value = 0;
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (validateAndSaveSettings()) {
            hideSettingsView();
          }
        }

        if (e.key === 'Escape') {
          cancelSettings();
        }
      });
    });

  window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
  });
});
