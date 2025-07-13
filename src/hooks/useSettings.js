import { useCallback, useState } from 'react';
import {
  DEFAULT_SETTINGS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS,
} from '../constants';
import { validateTimeValue } from '../utils/timeUtils';

export const useSettings = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [tempSettings, setTempSettings] = useState(settings);

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

  const updateTempSetting = useCallback((key, value) => {
    const maxValue = key.includes('Hours') ? MAX_HOURS
      : key.includes('Minutes') ? MAX_MINUTES : MAX_SECONDS;

    setTempSettings((prev) => ({
      ...prev,
      [key]: validateTimeValue(value, maxValue),
    }));
  }, []);

  return {
    isSettingsVisible,
    settings,
    tempSettings,
    showSettings,
    hideSettings,
    applySettings,
    updateTempSetting,
  };
};
