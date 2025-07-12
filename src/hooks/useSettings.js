import { useCallback, useState } from 'react';

export const useSettings = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settings, setSettings] = useState({
    minHours: 0,
    minMinutes: 4,
    minSeconds: 0,
    maxHours: 0,
    maxMinutes: 4,
    maxSeconds: 45,
  });
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
    setTempSettings(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(value, key.includes('Hours') ? 99 : 59)),
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
