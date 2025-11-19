import { useCallback, useState } from 'react';
import {
  DEFAULT_SETTINGS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS,
} from '@/constants';
import { convertToSeconds, validateTimeValue } from '@/utils/timeUtils';
import type { Settings, UseSettingsReturn } from '@/types';

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  const applySettings = useCallback(() => {
    const {
      maxSeconds,
      maxHours,
      minMinutes,
      maxMinutes,
      minHours,
      minSeconds,
    } = tempSettings;

    const minTimerInSeconds = convertToSeconds(minHours, minMinutes, minSeconds);
    const maxTimerInSeconds = convertToSeconds(maxHours, maxMinutes, maxSeconds);

    if (!minTimerInSeconds || !maxTimerInSeconds || minTimerInSeconds > maxTimerInSeconds) {
      return;
    }

    setSettings({ ...tempSettings });
  }, [tempSettings]);

  const updateTempSetting = useCallback((key: keyof Settings, value: number) => {
    const maxValue = key.includes('Hours') ? MAX_HOURS
      : key.includes('Minutes') ? MAX_MINUTES : MAX_SECONDS;

    setTempSettings((prev) => ({
      ...prev,
      [key]: validateTimeValue(value, maxValue),
    }));
  }, []);

  return {
    settings,
    tempSettings,
    applySettings,
    updateTempSetting,
  };
};
