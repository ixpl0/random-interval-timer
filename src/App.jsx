import React, { useCallback, useEffect, useRef, useState } from 'react';
import { initAudio, playBeep } from './sound.js';

const MAIN_BUTTON_TEXT = 'GO!';

function App() {
  const [, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [timerConfig, setTimerConfig] = useState({ minSeconds: 240, maxSeconds: 285 });
  const [originalConfig, setOriginalConfig] = useState(null);
  const [mainButtonText, setMainButtonText] = useState(MAIN_BUTTON_TEXT);
  const [isActiveTimer, setIsActiveTimer] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);

  const timerStopperRef = useRef(null);
  const countdownTimeoutsRef = useRef([]);

  const [minHours, setMinHours] = useState(0);
  const [minMinutes, setMinMinutes] = useState(0);
  const [minSeconds, setMinSeconds] = useState(0);
  const [maxHours, setMaxHours] = useState(0);
  const [maxMinutes, setMaxMinutes] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(0);

  const getRandomInterval = useCallback(() => {
    return Math.floor(timerConfig.minSeconds + Math.random() * (timerConfig.maxSeconds - timerConfig.minSeconds + 1));
  }, [timerConfig]);

  const formatTime = useCallback((seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else {
      return `${m}:${String(s).padStart(2, '0')}`;
    }
  }, []);

  const updateOverlay = useCallback((value) => {
    if (window.electronAPI) {
      window.electronAPI.updateTimerOverlay(value);
    }
  }, []);

  const playBeepWithOutline = useCallback(async () => {
    setIsBeeping(true);
    await playBeep();
    setIsBeeping(false);
  }, []);

  const startAccurateTimer = useCallback((callback) => {
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
  }, []);

  const tick = useCallback(async () => {
    setRemaining((prev) => {
      const newRemaining = prev - 1;

      if (newRemaining <= 0) {
        playBeepWithOutline();
        const newInterval = getRandomInterval();
        updateOverlay(formatTime(newInterval));
        setMainButtonText(formatTime(newInterval));
        setIsActiveTimer(true);
        return newInterval;
      } else {
        updateOverlay(formatTime(newRemaining));
        setMainButtonText(formatTime(newRemaining));
        return newRemaining;
      }
    });
  }, [formatTime, getRandomInterval, playBeepWithOutline, updateOverlay]);

  const stop = useCallback(() => {
    if (timerStopperRef.current) {
      timerStopperRef.current();
      timerStopperRef.current = null;
    }

    countdownTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    countdownTimeoutsRef.current = [];

    setIsRunning(false);
    setIsCountingDown(false);
    setMainButtonText(MAIN_BUTTON_TEXT);
    setIsActiveTimer(false);
    updateOverlay('');
  }, [updateOverlay]);

  const start = useCallback(async () => {
    if (isRunning || isCountingDown) {
      stop();
      return;
    }

    setIsRunning(true);
    setIsCountingDown(true);

    for (let i = 3; i > 0; i--) {
      setMainButtonText(String(i));
      await playBeepWithOutline();
      await new Promise((resolve) => {
        const timeoutId = setTimeout(resolve, 1000);
        countdownTimeoutsRef.current.push(timeoutId);
      });
    }

    setIsCountingDown(false);

    const newInterval = getRandomInterval();
    setRemaining(newInterval);
    setMainButtonText(formatTime(newInterval));
    setIsActiveTimer(true);
    updateOverlay(formatTime(newInterval));

    timerStopperRef.current = startAccurateTimer(tick);
  }, [isRunning, isCountingDown, stop, playBeepWithOutline, getRandomInterval, formatTime, updateOverlay, startAccurateTimer, tick]);

  const timeToSeconds = useCallback((hours, minutes, seconds) =>
    hours * 3600 + minutes * 60 + seconds, []);

  const secondsToTime = useCallback(totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }, []);

  const loadSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('timerConfig');
      if (saved) {
        const config = JSON.parse(saved);
        setTimerConfig(config);
      }
    } catch (e) {
      setTimerConfig({ minSeconds: 240, maxSeconds: 285 });
    }
  }, []);

  const saveSettings = useCallback(() => {
    localStorage.setItem('timerConfig', JSON.stringify(timerConfig));
  }, [timerConfig]);

  const updateModalInputs = useCallback(() => {
    const minTime = secondsToTime(timerConfig.minSeconds);
    const maxTime = secondsToTime(timerConfig.maxSeconds);

    setMinHours(minTime.hours);
    setMinMinutes(minTime.minutes);
    setMinSeconds(minTime.seconds);
    setMaxHours(maxTime.hours);
    setMaxMinutes(maxTime.minutes);
    setMaxSeconds(maxTime.seconds);
  }, [timerConfig, secondsToTime]);

  const showSettingsView = useCallback(() => {
    setIsSettingsMode(true);
    setOriginalConfig(structuredClone(timerConfig));
    updateModalInputs();
  }, [timerConfig, updateModalInputs]);

  const hideSettingsView = useCallback(() => {
    setIsSettingsMode(false);
    setOriginalConfig(null);
  }, []);

  const cancelSettings = useCallback(() => {
    if (originalConfig) {
      setTimerConfig(originalConfig);
    }
    hideSettingsView();
  }, [originalConfig, hideSettingsView]);

  const validateAndSaveSettings = useCallback(() => {
    const newMinSeconds = timeToSeconds(minHours, minMinutes, minSeconds);
    const newMaxSeconds = timeToSeconds(maxHours, maxMinutes, maxSeconds);

    if (newMinSeconds <= 0) {
      return false;
    }
    if (newMaxSeconds < newMinSeconds) {
      return false;
    }

    setTimerConfig({ minSeconds: newMinSeconds, maxSeconds: newMaxSeconds });
    hideSettingsView();
    return true;
  }, [minHours, minMinutes, minSeconds, maxHours, maxMinutes, maxSeconds, timeToSeconds, hideSettingsView]);

  const handleCloseClick = useCallback(() => {
    if (isSettingsMode) {
      cancelSettings();
    } else {
      if (isRunning) {
        stop();
      }
      if (window.electronAPI) {
        window.electronAPI.closeWindow();
      }
    }
  }, [isSettingsMode, isRunning, cancelSettings, stop]);

  const handleMinimizeClick = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  }, []);

  const handleSettingsClick = useCallback(() => {
    if (isSettingsMode) {
      if (validateAndSaveSettings()) {
        hideSettingsView();
      }
    } else {
      showSettingsView();
    }
  }, [isSettingsMode, validateAndSaveSettings, hideSettingsView, showSettingsView]);

  useEffect(() => {
    loadSettings();
    initAudio();
  }, [loadSettings]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  const settingsButtonTitle = isSettingsMode ? 'Apply' : 'Settings';
  const closeButtonTitle = isSettingsMode ? 'Cancel' : 'Close';

  return (
    <div className="page-wrapper">
      <div className="header">
        <div className="header-buttons">
          <button
            className="header-button settings-button"
            title={settingsButtonTitle}
            onClick={handleSettingsClick}
          />
          <button
            className="header-button minimize-button"
            title="Minimize"
            onClick={handleMinimizeClick}
          />
          <button
            className="header-button close-button"
            title={closeButtonTitle}
            onClick={handleCloseClick}
          />
        </div>
      </div>

      <div className="main">
        {!isSettingsMode && (
          <button
            className={`main-button ${isActiveTimer ? 'active-timer' : ''} ${isBeeping ? 'beeping' : ''}`}
            onClick={start}
          >
            {mainButtonText}
          </button>
        )}

        {isSettingsMode && (
          <div className="settings-view visible">
            <div className="settings-row">
              <div className="settings-label">MIN</div>
              <input
                type="number"
                className="time-mini-input"
                value={minHours}
                onChange={(e) => setMinHours(Number(e.target.value))}
                min="0"
                max="99"
              />
              <div className="mini-separator">:</div>
              <input
                type="number"
                className="time-mini-input"
                value={minMinutes}
                onChange={(e) => setMinMinutes(Number(e.target.value))}
                min="0"
                max="59"
              />
              <div className="mini-separator">:</div>
              <input
                type="number"
                className="time-mini-input"
                value={minSeconds}
                onChange={(e) => setMinSeconds(Number(e.target.value))}
                min="0"
                max="59"
              />
            </div>
            <div className="settings-row">
              <div className="settings-label">MAX</div>
              <input
                type="number"
                className="time-mini-input"
                value={maxHours}
                onChange={(e) => setMaxHours(Number(e.target.value))}
                min="0"
                max="99"
              />
              <div className="mini-separator">:</div>
              <input
                type="number"
                className="time-mini-input"
                value={maxMinutes}
                onChange={(e) => setMaxMinutes(Number(e.target.value))}
                min="0"
                max="59"
              />
              <div className="mini-separator">:</div>
              <input
                type="number"
                className="time-mini-input"
                value={maxSeconds}
                onChange={(e) => setMaxSeconds(Number(e.target.value))}
                min="0"
                max="59"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
