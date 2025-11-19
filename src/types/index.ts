export interface Settings {
  minHours: number;
  minMinutes: number;
  minSeconds: number;
  maxHours: number;
  maxMinutes: number;
  maxSeconds: number;
}

export type SoundType = 'random' | 'beep' | 'chime' | 'alert' | 'ding' | 'whistle' | 'chirp' | 'pulse';

export interface SoundSettings {
  selectedSound: SoundType;
  volume: number;
}

export interface UseTimerReturn {
  isRunning: boolean;
  isCountingDown: boolean;
  remaining: number;
  isBeeping: boolean;
  mainButtonText: string;
  toggleTimer: () => void;
  stop: () => void;
}

export interface UseSettingsReturn {
  settings: Settings;
  tempSettings: Settings;
  applySettings: () => void;
  updateTempSetting: (key: keyof Settings, value: number) => void;
}

export interface UseSoundSettingsReturn {
  soundSettings: SoundSettings;
  tempSoundSettings: SoundSettings;
  applySoundSettings: () => void;
  updateTempSoundSetting: (soundType: SoundType) => void;
  updateTempVolume: (volume: number) => void;
}

export type ActiveView = 'main' | 'settings' | 'soundSettings';

interface Actions {
  show: () => void;
  apply: () => void;
}

export interface HeaderProps {
  activeView: ActiveView;
  settingsActions: Actions;
  soundSettingsActions: Actions;
  goToMain: () => void;
}

export interface MainButtonProps {
  isRunning: boolean;
  isBeeping: boolean;
  mainButtonText: string;
  onClick: () => void;
}

export interface SettingsViewProps {
  isVisible: boolean;
  tempSettings: Settings;
  updateTempSetting: (key: keyof Settings, value: number) => void;
}

export interface SoundSettingsViewProps {
  isVisible: boolean;
  tempSoundSettings: SoundSettings;
  updateTempSoundSetting: (soundType: SoundType) => void;
  updateTempVolume: (volume: number) => void;
}

export interface TimeInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (value: number) => void;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
}

export interface TimeSettingsRowProps extends TimeInputProps {
  label: string;
}

export interface SoundOption {
  type: SoundType;
  icon: string;
  label: string;
}

export interface ElectronAPI {
  close: () => void;
  minimize: () => void;
  setOverlayIcon: (dataURL: string) => void;
  initLog?: (message: string) => void;
  writeLog?: (message: string) => void;
}

export type Timeout = ReturnType<typeof setTimeout>;
