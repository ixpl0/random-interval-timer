import { PENDING_RETRY_INTERVAL_MS } from './types';
import {
  clearPendingRetry, getPendingSoundState, resetPendingSoundState,
} from './audioState';
import { executeSoundByType } from './soundExecutor';
import { ensureRunningContext } from './audioContextManager';

export const createPendingSoundPromise = (): Promise<void> => {
  const state = getPendingSoundState();

  state.promise ||= new Promise<void>((resolve) => {
    state.resolve = resolve;
  });

  return state.promise;
};

export const triggerPendingSound = (context: AudioContext): void => {
  const state = getPendingSoundState();

  if (!state.soundType) {
    return;
  }

  clearPendingRetry();

  const soundType = state.soundType;
  const resolve = state.resolve;

  resetPendingSoundState();

  executeSoundByType(soundType, context, () => {
    resolve?.();
  });
};

export const processPendingSound = async (): Promise<boolean> => {
  const state = getPendingSoundState();

  if (!state.soundType) {
    return true;
  }

  const context = await ensureRunningContext();

  if (!context) {
    return false;
  }

  triggerPendingSound(context);

  return true;
};

export const schedulePendingSoundRetry = (): void => {
  const state = getPendingSoundState();

  if (state.retryTimeoutId !== null || !state.soundType) {
    return;
  }

  state.retryTimeoutId = setTimeout(() => {
    state.retryTimeoutId = null;
    void processPendingSound()
      .then((processed) => {
        if (!processed) {
          schedulePendingSoundRetry();
        }
      });
  }, PENDING_RETRY_INTERVAL_MS);
};

