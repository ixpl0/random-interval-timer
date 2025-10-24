import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  COUNTDOWN_NUMBERS, MAIN_BUTTON_TEXT, MILLISECONDS_PER_SECOND,
} from '@/constants';
import {
  convertToSeconds, formatTime, getRandomInt,
} from '@/utils/timeUtils';
import { createAccurateTimer } from '@/utils/timerUtils';
import { playSound } from '@/utils/audioUtils';
import { setOverlayIcon } from '@/utils/electronUtils.ts';
import type {
  Settings,
  SoundSettings,
  Timeout,
  UseTimerReturn,
} from '@/types';

export const useTimer = (settings: Settings, soundSettings: SoundSettings): UseTimerReturn => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [mainButtonText, setMainButtonText] = useState<string>(MAIN_BUTTON_TEXT);
  const [isBeeping, setIsBeeping] = useState<boolean>(false);

  const timerStopperRef = useRef<(() => void) | null>(null);
  const countdownTimeoutsRef = useRef<Timeout[]>([]);
  const remainingRef = useRef<number>(0);
  const soundSettingsRef = useRef<SoundSettings>(soundSettings);

  useEffect(() => {
    soundSettingsRef.current = soundSettings;
  }, [soundSettings]);

  const updateOverlay = useCallback((text: string) => {
    setOverlayIcon(text);
  }, []);

  const getRandomInterval = useCallback((): number => {
    const minSeconds = convertToSeconds(settings.minHours, settings.minMinutes, settings.minSeconds);
    const maxSeconds = convertToSeconds(settings.maxHours, settings.maxMinutes, settings.maxSeconds);

    return getRandomInt(minSeconds, maxSeconds);
  }, [settings.minHours, settings.minMinutes, settings.minSeconds, settings.maxHours, settings.maxMinutes, settings.maxSeconds]);

  const playSelectedSound = useCallback(async (): Promise<void> => {
    setIsBeeping(true);
    await playSound(soundSettingsRef.current.selectedSound);
    setIsBeeping(false);
  }, []);

  const tick = useCallback((): void => {
    remainingRef.current = remainingRef.current - 1;
    const newRemaining = remainingRef.current;

    if (newRemaining <= 0) {
      playSelectedSound();
      const newInterval = getRandomInterval();

      remainingRef.current = newInterval;
      updateOverlay(formatTime(newInterval));
      setMainButtonText(formatTime(newInterval));
    } else {
      updateOverlay(formatTime(newRemaining));
      setMainButtonText(formatTime(newRemaining));
    }
  }, [getRandomInterval, playSelectedSound, updateOverlay]);

  const stop = useCallback((): void => {
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

  const start = useCallback(async (): Promise<void> => {
    if (isRunning || isCountingDown) {
      return;
    }

    setIsCountingDown(true);

    for (const number of COUNTDOWN_NUMBERS) {
      const countdownDigit = String(number);

      setMainButtonText(countdownDigit);
      updateOverlay(countdownDigit);
      playSelectedSound();

      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(resolve, MILLISECONDS_PER_SECOND);

        countdownTimeoutsRef.current.push(timeoutId);
      });
    }

    setIsCountingDown(false);
    setIsRunning(true);

    const interval = getRandomInterval();

    remainingRef.current = interval;
    setMainButtonText(formatTime(interval));
    updateOverlay(formatTime(interval));

    timerStopperRef.current = createAccurateTimer(tick, MILLISECONDS_PER_SECOND);
  }, [getRandomInterval, playSelectedSound, tick, updateOverlay, isRunning, isCountingDown]);

  const toggleTimer = useCallback((): void => {
    if (isRunning || isCountingDown) {
      stop();
    } else {
      start();
    }
  }, [isRunning, isCountingDown, start, stop]);

  return {
    isRunning,
    isCountingDown,
    remaining: remainingRef.current,
    isBeeping,
    mainButtonText,
    toggleTimer,
    stop,
  };
};
