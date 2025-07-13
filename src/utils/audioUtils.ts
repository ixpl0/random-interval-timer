import {
  BEEP_DURATION,
  BEEP_FREQUENCY,
  BEEP_VOLUME,
  FILTER_FREQUENCY,
} from '@/constants';

let audioContext: AudioContext | null = null;

export const initAudio = (): void => {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
};

export const playBeep = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    initAudio();

    if (!audioContext || audioContext.state !== 'running') {
      audioContext?.resume()
        .then(() => {
          if (!audioContext || audioContext.state !== 'running') {
            resolve();

            return;
          }

          executeBeep(resolve);
        });

      return;
    }

    executeBeep(resolve);
  });
};

const executeBeep = (resolve: () => void): void => {
  if (!audioContext) {
    return;
  }

  const oscillator = audioContext.createOscillator();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(BEEP_FREQUENCY, audioContext.currentTime);

  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(FILTER_FREQUENCY, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(audioContext.destination);
  gainNode.gain.setValueAtTime(BEEP_VOLUME, audioContext.currentTime);
  gainNode.gain.setValueAtTime(BEEP_VOLUME, audioContext.currentTime + BEEP_DURATION);
  gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + BEEP_DURATION);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + BEEP_DURATION);
  oscillator.onended = () => resolve();
};
