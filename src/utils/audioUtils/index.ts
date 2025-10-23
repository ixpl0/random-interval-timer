import type { SoundType } from '@/types';
import { logSound } from '@/utils/logger';
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
      logSound('KeepAlive: context suspended, пытаюсь resume');
      void context.resume()
        .then(() => {
          logSound(`KeepAlive: resume успешен, state: ${context.state}`);
        })
        .catch((error) => {
          logSound(`KeepAlive: resume failed: ${error instanceof Error ? error.message : String(error)}`);
        });
    } else if (context.state === 'running') {
      logSound('KeepAlive: отправка беззвучного сигнала');
      playSilentTone(context);
    }
  }, AUDIO_CONTEXT_KEEPALIVE_INTERVAL_MS);
};

export const initAudio = (): void => {
  getOrCreateAudioContext();
  keepAudioContextAlive();
};

export const playSound = async (soundType: SoundType): Promise<void> => {
  logSound(`Запрос: ${soundType}`);
  const context = getOrCreateAudioContext();
  const state = getPendingSoundState();
  const hasPendingSound = Boolean(state.promise);

  logSound(`AudioContext state: ${context.state}, pending: ${hasPendingSound}`);

  if (context.state === 'suspended') {
    logSound('AudioContext suspended, пытаюсь resume');

    try {
      await context.resume();
      logSound(`Resume успешен, новый state: ${context.state}`);
    } catch (error) {
      logSound(`Resume failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (context.state === 'running' && !hasPendingSound) {
    logSound('Прямое воспроизведение');
    await new Promise<void>((resolve) => {
      executeSoundByType(soundType, context, resolve);
    });
    logSound('Завершено');

    return;
  }

  logSound('Отложенное воспроизведение');
  state.soundType = soundType;
  const pendingPlayback = createPendingSoundPromise();

  if (context.state === 'running') {
    triggerPendingSound(context);

    return pendingPlayback;
  }

  const processed = await processPendingSound();

  if (!processed) {
    logSound('Retry запланирован');
    schedulePendingSoundRetry();
  }

  return pendingPlayback;
};

export const playBeep = (): Promise<void> => {
  return playSound('beep');
};

export { executeSoundByType } from './soundExecutor';
