import { useCallback, useState } from 'react';
import type {
  SoundSettings,
  SoundType,
  UseSoundSettingsReturn,
} from '@/types';

const DEFAULT_SOUND_SETTINGS: SoundSettings = { selectedSound: 'beep' };

export const useSoundSettings = (): UseSoundSettingsReturn => {
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const [tempSoundSettings, setTempSoundSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const [isSoundSettingsVisible, setIsSoundSettingsVisible] = useState<boolean>(false);

  const applySoundSettings = useCallback((): void => {
    setSoundSettings(tempSoundSettings);
    setIsSoundSettingsVisible(false);
  }, [tempSoundSettings]);

  const hideSoundSettings = useCallback((): void => {
    setTempSoundSettings(soundSettings);
    setIsSoundSettingsVisible(false);
  }, [soundSettings]);

  const showSoundSettings = useCallback((): void => {
    setTempSoundSettings(soundSettings);
    setIsSoundSettingsVisible(true);
  }, [soundSettings]);

  const updateTempSoundSetting = useCallback((soundType: SoundType): void => {
    setTempSoundSettings({ selectedSound: soundType });
  }, []);

  return {
    applySoundSettings,
    hideSoundSettings,
    isSoundSettingsVisible,
    showSoundSettings,
    soundSettings,
    tempSoundSettings,
    updateTempSoundSetting,
  };
};
