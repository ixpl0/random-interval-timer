import type { PendingSoundState } from './types';
import type { SoundType } from '@/types';
import { DEFAULT_VOLUME } from './types';

let audioContext: AudioContext | null = null;

let pendingSoundState: PendingSoundState = {
  soundType: null,
  volume: DEFAULT_VOLUME,
  promise: null,
  resolve: null,
  retryTimeoutId: null,
};

export const getAudioContext = (): AudioContext | null => audioContext;

export const setAudioContext = (context: AudioContext | null): void => {
  audioContext = context;
};

export const getPendingSoundState = (): PendingSoundState => pendingSoundState;

export const updatePendingSoundState = (updates: Partial<PendingSoundState>): void => {
  pendingSoundState = {
    ...pendingSoundState,
    ...updates,
  };
};

export const setPendingSound = (soundType: SoundType, volume: number): void => {
  pendingSoundState = {
    ...pendingSoundState,
    soundType,
    volume,
  };
};

export const setPendingPromise = (promise: Promise<void>, resolve: () => void): void => {
  pendingSoundState = {
    ...pendingSoundState,
    promise,
    resolve,
  };
};

export const setRetryTimeoutId = (timeoutId: ReturnType<typeof setTimeout> | null): void => {
  pendingSoundState = {
    ...pendingSoundState,
    retryTimeoutId: timeoutId,
  };
};

export const clearPendingRetry = (): void => {
  if (pendingSoundState.retryTimeoutId !== null) {
    clearTimeout(pendingSoundState.retryTimeoutId);
    pendingSoundState = {
      ...pendingSoundState,
      retryTimeoutId: null,
    };
  }
};

export const resetPendingSoundState = (): void => {
  clearPendingRetry();
  pendingSoundState = {
    ...pendingSoundState,
    soundType: null,
    volume: DEFAULT_VOLUME,
    promise: null,
    resolve: null,
  };
};
