import type { PendingSoundState } from './types';

let audioContext: AudioContext | null = null;

const pendingSoundState: PendingSoundState = {
  soundType: null,
  promise: null,
  resolve: null,
  retryTimeoutId: null,
};

export const getAudioContext = (): AudioContext | null => audioContext;

export const setAudioContext = (context: AudioContext | null): void => {
  audioContext = context;
};

export const getPendingSoundState = (): PendingSoundState => pendingSoundState;

export const clearPendingRetry = (): void => {
  if (pendingSoundState.retryTimeoutId !== null) {
    clearTimeout(pendingSoundState.retryTimeoutId);
    pendingSoundState.retryTimeoutId = null;
  }
};

export const resetPendingSoundState = (): void => {
  clearPendingRetry();
  pendingSoundState.soundType = null;
  pendingSoundState.promise = null;
  pendingSoundState.resolve = null;
};
