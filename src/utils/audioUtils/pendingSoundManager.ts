import { PENDING_RETRY_INTERVAL_MS } from './types';
import {
  clearPendingRetry,
  getPendingSoundState,
  resetPendingSoundState,
  setPendingPromise,
  setRetryTimeoutId,
} from './audioState';
import { executeSoundByType } from './soundExecutor';
import { ensureRunningContext } from './audioContextManager';

export const createPendingSoundPromise = (): Promise<void> => {
  const state = getPendingSoundState();

  if (state.promise) {
    return state.promise;
  }

  const promise = new Promise<void>((resolve) => {
    setPendingPromise(promise, resolve);
  });

  return promise;
};

export const triggerPendingSound = (context: AudioContext): void => {
  const state = getPendingSoundState();

  if (!state.soundType) {
    return;
  }

  clearPendingRetry();

  const {
    soundType, volume, resolve,
  } = state;

  resetPendingSoundState();

  executeSoundByType(soundType, context, volume, () => {
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

  const timeoutId = setTimeout(() => {
    setRetryTimeoutId(null);
    void processPendingSound()
      .then((processed) => {
        if (!processed) {
          schedulePendingSoundRetry();
        }
      });
  }, PENDING_RETRY_INTERVAL_MS);

  setRetryTimeoutId(timeoutId);
};

