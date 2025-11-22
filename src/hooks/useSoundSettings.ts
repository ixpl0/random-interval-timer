import { useCallback } from 'react';
import type {
  SoundSettings, SoundType, UseSoundSettingsReturn,
} from '@/types';
import { usePersistentSettings } from './usePersistentSettings';

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  selectedSound: 'beep',
  volume: 0.5,
};

export const useSoundSettings = (): UseSoundSettingsReturn => {
  const {
    settings: soundSettings,
    tempSettings: tempSoundSettings,
    setTempSettings,
    applySettings: applySoundSettings,
    resetTempSettings: resetTempSoundSettings,
  } = usePersistentSettings<SoundSettings>('sound', DEFAULT_SOUND_SETTINGS);

  const updateTempSoundSetting = useCallback((soundType: SoundType): void => {
    setTempSettings((prev) => ({
      ...prev,
      selectedSound: soundType,
    }));
  }, [setTempSettings]);

  const updateTempVolume = useCallback((volume: number): void => {
    setTempSettings((prev) => ({
      ...prev,
      volume,
    }));
  }, [setTempSettings]);

  return {
    soundSettings,
    tempSoundSettings,
    applySoundSettings,
    updateTempSoundSetting,
    updateTempVolume,
    resetTempSoundSettings,
  };
};
