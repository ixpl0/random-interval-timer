import type {
  Dispatch,
  SetStateAction,
} from 'react';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

interface UsePersistentSettingsReturn<T> {
  settings: T;
  tempSettings: T;
  setTempSettings: Dispatch<SetStateAction<T>>;
  applySettings: () => Promise<void>;
  resetTempSettings: () => void;
}

export const usePersistentSettings = <T extends object>(
  storageKey: string,
  defaultSettings: T,
): UsePersistentSettingsReturn<T> => {
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [tempSettings, setTempSettings] = useState<T>(defaultSettings);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      if (!window?.electronAPI?.getSetting) {
        return;
      }

      const storedSettings = await window.electronAPI.getSetting(storageKey);

      if (storedSettings) {
        const newSettings = {
          ...defaultSettings,
          ...(storedSettings as T),
        };

        setSettings(newSettings);
        setTempSettings(newSettings);
      }
    };

    void loadSettings();
  }, [storageKey, defaultSettings]);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const applySettings = useCallback(async () => {
    if (window?.electronAPI?.setSetting) {
      await window.electronAPI.setSetting(storageKey, tempSettings);
    }

    setSettings(tempSettings);
  }, [tempSettings, storageKey]);

  const resetTempSettings = useCallback(() => {
    setTempSettings(settings);
  }, [settings]);

  return {
    settings,
    tempSettings,
    setTempSettings,
    applySettings,
    resetTempSettings,
  };
};
