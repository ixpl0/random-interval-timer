export interface Settings {
  minHours: number;
  minMinutes: number;
  minSeconds: number;
  maxHours: number;
  maxMinutes: number;
  maxSeconds: number;
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
  isSettingsVisible: boolean;
  showSettings: () => void;
  applySettings: () => void;
  hideSettings: () => void;
  updateTempSetting: (key: keyof Settings, value: number) => void;
}

export interface HeaderProps {
  isSettingsVisible: boolean;
  showSettings: () => void;
  hideSettings: () => void;
  applySettings: () => void;
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

export interface TimeInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (value: number) => void;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
}

export interface ElectronAPI {
  close: () => void;
  minimize: () => void;
  setOverlayIcon: (dataURL: string) => void;
}

export type Timeout = ReturnType<typeof setTimeout>;
