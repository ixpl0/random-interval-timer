import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  DEFAULT_SETTINGS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS,
} from '@/constants';
import { convertToSeconds, validateTimeValue } from '@/utils/timeUtils';
import type { Settings, UseSettingsReturn } from '@/types';

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      const storedSettings = await window.electronAPI.getSetting('timer');

      if (storedSettings) {
        const newSettings = {
          ...DEFAULT_SETTINGS,
          ...storedSettings as Settings,
        };

        setSettings(newSettings);
        setTempSettings(newSettings);
      }
    };

    void loadSettings();
  }, []);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const applySettings: () => Promise<void> = useCallback(async () => {
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

    if (minTimerInSeconds === 0 || maxTimerInSeconds === 0 || minTimerInSeconds > maxTimerInSeconds) {
      return;
    }

    await window.electronAPI.setSetting('timer', tempSettings);
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
