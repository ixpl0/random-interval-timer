import {
  useCallback, useEffect, useMemo, useRef, useState,
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

type TimerState = 'idle' | 'countdown' | 'running';

export const useTimer = (settings: Settings, soundSettings: SoundSettings): UseTimerReturn => {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [countdownValue, setCountdownValue] = useState<string>('');
  const [isBeeping, setIsBeeping] = useState<boolean>(false);

  const timerStopperRef = useRef<(() => void) | null>(null);
  const countdownTimeoutsRef = useRef<Timeout[]>([]);
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
    setRemainingTime((prev) => {
      const newRemaining = prev - 1;

      if (newRemaining <= 0) {
        void playSelectedSound();
        const newInterval = getRandomInterval();

        updateOverlay(formatTime(newInterval));

        return newInterval;
      }

      updateOverlay(formatTime(newRemaining));

      return newRemaining;
    });
  }, [getRandomInterval, playSelectedSound, updateOverlay]);

  const stop = useCallback((): void => {
    if (timerStopperRef.current) {
      timerStopperRef.current();
      timerStopperRef.current = null;
    }

    countdownTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    countdownTimeoutsRef.current = [];

    setTimerState('idle');
    setRemainingTime(0);
    setCountdownValue('');
    updateOverlay('');
  }, [updateOverlay]);

  const start = useCallback(async (): Promise<void> => {
    if (timerState !== 'idle') {
      return;
    }

    setTimerState('countdown');

    for (const number of COUNTDOWN_NUMBERS) {
      const countdownDigit = String(number);

      setCountdownValue(countdownDigit);
      updateOverlay(countdownDigit);
      void playSelectedSound();

      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(resolve, MILLISECONDS_PER_SECOND);

        countdownTimeoutsRef.current.push(timeoutId);
      });
    }

    setTimerState('running');
    setCountdownValue('');

    const interval = getRandomInterval();

    setRemainingTime(interval);
    updateOverlay(formatTime(interval));

    timerStopperRef.current = createAccurateTimer(tick, MILLISECONDS_PER_SECOND);
  }, [getRandomInterval, playSelectedSound, tick, updateOverlay, timerState]);

  const toggleTimer = useCallback((): void => {
    if (timerState !== 'idle') {
      stop();
    } else {
      void start();
    }
  }, [timerState, start, stop]);

  const mainButtonText = useMemo(() => {
    if (timerState === 'countdown') {
      return countdownValue;
    }

    if (timerState === 'running') {
      return formatTime(remainingTime);
    }

    return MAIN_BUTTON_TEXT;
  }, [timerState, countdownValue, remainingTime]);

  const isRunning = timerState === 'running';
  const isCountingDown = timerState === 'countdown';

  return {
    isRunning,
    isCountingDown,
    remaining: remainingTime,
    isBeeping,
    mainButtonText,
    toggleTimer,
    stop,
  };
};
