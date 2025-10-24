import type { SoundType } from '@/types';
import { getOrCreateAudioContext } from './audioContextManager';
import {
  createPendingSoundPromise,
  processPendingSound,
  schedulePendingSoundRetry,
  triggerPendingSound,
} from './pendingSoundManager';
import { executeSoundByType } from './soundExecutor';
import { getPendingSoundState } from './audioState';

const AUDIO_CONTEXT_KEEPALIVE_INTERVAL_MS = 15000;

const playSilentTone = (context: AudioContext): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  gainNode.gain.setValueAtTime(0.001, context.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.01);
};

const keepAudioContextAlive = (): void => {
  setInterval(() => {
    const context = getOrCreateAudioContext();

    if (context.state === 'suspended') {
      void context.resume();
    } else if (context.state === 'running') {
      playSilentTone(context);
    }
  }, AUDIO_CONTEXT_KEEPALIVE_INTERVAL_MS);
};

export const initAudio = (): void => {
  getOrCreateAudioContext();
  keepAudioContextAlive();
};

export const playSound = async (soundType: SoundType): Promise<void> => {
  const context = getOrCreateAudioContext();
  const state = getPendingSoundState();
  const hasPendingSound = Boolean(state.promise);

  if (context.state === 'suspended') {
    await context.resume();
  }

  if (context.state === 'running' && !hasPendingSound) {
    await new Promise<void>((resolve) => {
      executeSoundByType(soundType, context, resolve);
    });

    return;
  }

  state.soundType = soundType;
  const pendingPlayback = createPendingSoundPromise();

  if (context.state === 'running') {
    triggerPendingSound(context);

    return pendingPlayback;
  }

  const processed = await processPendingSound();

  if (!processed) {
    schedulePendingSoundRetry();
  }

  return pendingPlayback;
};

export const playBeep = (): Promise<void> => {
  return playSound('beep');
};

export { executeSoundByType } from './soundExecutor';
