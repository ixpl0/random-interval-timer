import type { ExtendedAudioContextState } from './types';
import { getAudioContext, setAudioContext } from './audioState';
import { triggerPendingSound } from './pendingSoundManager';

const isSuspendedLikeState = (state: ExtendedAudioContextState): boolean => {
  return state === 'suspended' || state === 'interrupted';
};

const handleStateChange = (context: AudioContext): (() => void) => {
  return () => {
    const state = context.state as ExtendedAudioContextState;

    if (state === 'running') {
      triggerPendingSound(context);

      return;
    }

    if (isSuspendedLikeState(state)) {
      void context.resume()
        .catch(() => {});
    }
  };
};

const createAudioContext = (): AudioContext => {
  const context = new window.AudioContext();

  context.addEventListener?.('statechange', handleStateChange(context));

  return context;
};

export const getOrCreateAudioContext = (): AudioContext => {
  const existingContext = getAudioContext();

  if (existingContext && existingContext.state !== 'closed') {
    return existingContext;
  }

  const newContext = createAudioContext();

  setAudioContext(newContext);

  return newContext;
};

export const recreateAudioContext = async (): Promise<AudioContext | null> => {
  const previousContext = getAudioContext();

  if (previousContext && previousContext.state !== 'closed') {
    try {
      await previousContext.close();
    } catch {
      // ignore close failures and continue with a fresh context
    }
  }

  const newContext = createAudioContext();

  setAudioContext(newContext);

  try {
    if (newContext.state !== 'running') {
      await newContext.resume();
    }
  } catch {
    // resume can still fail without user interaction; let the caller retry later
  }

  return newContext.state === 'running' ? newContext : null;
};

export const ensureRunningContext = async (): Promise<AudioContext | null> => {
  const context = getOrCreateAudioContext();

  if (context.state === 'running') {
    return context;
  }

  try {
    await context.resume();
  } catch {
    return recreateAudioContext();
  }

  const state = context.state as ExtendedAudioContextState;

  if (state === 'running') {
    return context;
  }

  if (isSuspendedLikeState(state)) {
    return recreateAudioContext();
  }

  return null;
};
