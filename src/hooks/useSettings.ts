import { useCallback } from 'react';
import {
  DEFAULT_SETTINGS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS,
} from '@/constants';
import { convertToSeconds, validateTimeValue } from '@/utils/timeUtils';
import type { Settings, UseSettingsReturn } from '@/types';
import { usePersistentSettings } from './usePersistentSettings';

export const useSettings = (): UseSettingsReturn => {
  const {
    settings,
    tempSettings,
    setTempSettings,
    applySettings: apply,
    resetTempSettings,
  } = usePersistentSettings<Settings>('timer', DEFAULT_SETTINGS);

  const applySettings = useCallback(async () => {
    const {
      minHours, minMinutes, minSeconds, maxHours, maxMinutes, maxSeconds,
    } = tempSettings;
    const minTimerInSeconds = convertToSeconds(minHours, minMinutes, minSeconds);
    const maxTimerInSeconds = convertToSeconds(maxHours, maxMinutes, maxSeconds);

    if (minTimerInSeconds === 0 || maxTimerInSeconds === 0 || minTimerInSeconds > maxTimerInSeconds) {
      return;
    }

    await apply();
  }, [tempSettings, apply]);

  const updateTempSetting = useCallback((key: keyof Settings, value: number) => {
    let maxValue: number;

    if (key.endsWith('Hours')) {
      maxValue = MAX_HOURS;
    } else if (key.endsWith('Minutes')) {
      maxValue = MAX_MINUTES;
    } else {
      maxValue = MAX_SECONDS;
    }

    setTempSettings((prev) => ({
      ...prev,
      [key]: validateTimeValue(value, maxValue),
    }));
  }, [setTempSettings]);

  return {
    settings,
    tempSettings,
    applySettings,
    updateTempSetting,
    resetTempSettings,
  };
};
