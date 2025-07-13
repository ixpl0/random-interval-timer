import { useCallback, useState } from 'react';
import {
  DEFAULT_SETTINGS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS,
} from '@/constants';
import { validateTimeValue } from '@/utils/timeUtils';
import type { Settings, UseSettingsReturn } from '@/types';

export const useSettings = (): UseSettingsReturn => {
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  const showSettings = useCallback(() => {
    setTempSettings({ ...settings });
    setIsSettingsVisible(true);
  }, [settings]);

  const hideSettings = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const applySettings = useCallback(() => {
    setSettings({ ...tempSettings });
    setIsSettingsVisible(false);
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
    isSettingsVisible,
    showSettings,
    applySettings,
    hideSettings,
    updateTempSetting,
  };
};
