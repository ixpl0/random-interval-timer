import {
  useCallback, useEffect, useState,
} from 'react';
import type {
  SoundSettings,
  SoundType,
  UseSoundSettingsReturn,
} from '@/types';

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  selectedSound: 'beep',
  volume: 0.5,
};

export const useSoundSettings = (): UseSoundSettingsReturn => {
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const [tempSoundSettings, setTempSoundSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      const storedSettings = await window.electronAPI.getSetting('sound');

      if (storedSettings) {
        const newSettings = {
          ...DEFAULT_SOUND_SETTINGS,
          ...storedSettings as SoundSettings,
        };

        setSoundSettings(newSettings);
        setTempSoundSettings(newSettings);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    setTempSoundSettings(soundSettings);
  }, [soundSettings]);

  const applySoundSettings: () => Promise<void> = useCallback(async () => {
    await window.electronAPI.setSetting('sound', tempSoundSettings);
    setSoundSettings(tempSoundSettings);
  }, [tempSoundSettings]);

  const updateTempSoundSetting = useCallback((soundType: SoundType): void => {
    setTempSoundSettings((prev) => ({
      ...prev,
      selectedSound: soundType,
    }));
  }, []);

  const updateTempVolume = useCallback((volume: number): void => {
    setTempSoundSettings((prev) => ({
      ...prev,
      volume,
    }));
  }, []);

  const resetTempSoundSettings = useCallback(() => {
    setTempSoundSettings(soundSettings);
  }, [soundSettings]);

  return {
    applySoundSettings,
    soundSettings,
    tempSoundSettings,
    updateTempSoundSetting,
    updateTempVolume,
    resetTempSoundSettings,
  };
};
