import { useCallback, useState } from 'react';
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

  const applySoundSettings = useCallback((): void => {
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

  return {
    applySoundSettings,
    soundSettings,
    tempSoundSettings,
    updateTempSoundSetting,
    updateTempVolume,
  };
};
