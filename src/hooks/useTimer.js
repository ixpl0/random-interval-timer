import { useCallback, useRef, useState } from 'react';
import { COUNTDOWN_NUMBERS, MAIN_BUTTON_TEXT } from '../constants';
import { convertToSeconds, formatTime, getRandomInt } from '../utils/timeUtils';
import { createAccurateTimer } from '../utils/timerUtils';
import { playBeep } from '../utils/audioUtils';

export const useTimer = (settings) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [mainButtonText, setMainButtonText] = useState(MAIN_BUTTON_TEXT);
  const [isBeeping, setIsBeeping] = useState(false);

  const timerStopperRef = useRef(null);
  const countdownTimeoutsRef = useRef([]);
  const remainingRef = useRef(0);

  const updateOverlay = useCallback((text) => {
    window.electronAPI?.updateOverlay?.(text);
  }, []);

  const getRandomInterval = useCallback(() => {
    const minSeconds = convertToSeconds(settings.minHours, settings.minMinutes, settings.minSeconds);
    const maxSeconds = convertToSeconds(settings.maxHours, settings.maxMinutes, settings.maxSeconds);

    return getRandomInt(minSeconds, maxSeconds);
  }, [settings.minHours, settings.minMinutes, settings.minSeconds, settings.maxHours, settings.maxMinutes, settings.maxSeconds]);

  const playBeepWithOutline = useCallback(async () => {
    setIsBeeping(true);
    await playBeep();
    setIsBeeping(false);
  }, []);

  const tick = useCallback(async () => {
    remainingRef.current = remainingRef.current - 1;
    const newRemaining = remainingRef.current;

    if (newRemaining <= 0) {
      playBeepWithOutline();
      const newInterval = getRandomInterval();
      remainingRef.current = newInterval;
      updateOverlay(formatTime(newInterval));
      setMainButtonText(formatTime(newInterval));
    } else {
      updateOverlay(formatTime(newRemaining));
      setMainButtonText(formatTime(newRemaining));
    }
  }, [getRandomInterval, playBeepWithOutline, updateOverlay]);

  const stop = useCallback(() => {
    if (timerStopperRef.current) {
      timerStopperRef.current();
      timerStopperRef.current = null;
    }

    countdownTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    countdownTimeoutsRef.current = [];

    setIsRunning(false);
    setIsCountingDown(false);
    setMainButtonText(MAIN_BUTTON_TEXT);
    updateOverlay('');
  }, [updateOverlay]);

  const start = useCallback(async () => {
    if (isRunning || isCountingDown) {
      return;
    }

    setIsCountingDown(true);

    for (let i = 0; i < COUNTDOWN_NUMBERS.length; i++) {
      const number = COUNTDOWN_NUMBERS[i];

      setMainButtonText(String(number));
      updateOverlay(String(number));

      const timeoutId = setTimeout(playBeepWithOutline, 0);
      countdownTimeoutsRef.current.push(timeoutId);

      if (i < COUNTDOWN_NUMBERS.length - 1) {
        await new Promise((resolve) => {
          const timeoutId = setTimeout(resolve, 1000);
          countdownTimeoutsRef.current.push(timeoutId);
        });
      }
    }

    setIsCountingDown(false);
    setIsRunning(true);

    const newInterval = getRandomInterval();
    remainingRef.current = newInterval;

    updateOverlay(formatTime(newInterval));
    setMainButtonText(formatTime(newInterval));

    timerStopperRef.current = createAccurateTimer(tick);
  }, [isRunning, isCountingDown, updateOverlay, playBeepWithOutline, getRandomInterval, tick]);

  const toggleTimer = useCallback(() => {
    if (isRunning || isCountingDown) {
      stop();
    } else {
      start();
    }
  }, [isRunning, isCountingDown, start, stop]);

  return {
    isRunning,
    isCountingDown,
    mainButtonText,
    isBeeping,
    start,
    stop,
    toggleTimer,
  };
};
