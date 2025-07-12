import { useCallback, useRef, useState } from 'react';
import { playBeep } from '../sound.js';

const MAIN_BUTTON_TEXT = 'GO!';

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
    const minSeconds = settings.minHours * 3600 + settings.minMinutes * 60 + settings.minSeconds;
    const maxSeconds = settings.maxHours * 3600 + settings.maxMinutes * 60 + settings.maxSeconds;

    return Math.floor(minSeconds + Math.random() * (maxSeconds - minSeconds + 1));
  }, [settings.minHours, settings.minMinutes, settings.minSeconds, settings.maxHours, settings.maxMinutes, settings.maxSeconds]);

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
  }, [formatTime, getRandomInterval, playBeepWithOutline, updateOverlay]);

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
    remainingRef.current = newInterval;
    setMainButtonText(formatTime(newInterval));
    updateOverlay(formatTime(newInterval));

    timerStopperRef.current = startAccurateTimer(tick);
  }, [isRunning, isCountingDown, stop, playBeepWithOutline, getRandomInterval, formatTime, updateOverlay, startAccurateTimer, tick]);

  const toggleTimer = useCallback(() => {
    if (isRunning || isCountingDown) {
      stop();
    } else {
      start();
    }
  }, [isRunning, isCountingDown, stop, start]);

  return {
    isRunning,
    mainButtonText,
    isBeeping,
    toggleTimer,
  };
};
