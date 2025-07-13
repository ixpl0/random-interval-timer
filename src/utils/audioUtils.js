import {
  BEEP_DURATION,
  BEEP_FREQUENCY,
  BEEP_VOLUME,
  FILTER_FREQUENCY,
} from '../constants';

let audioContext = null;

export const initAudio = () => {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

export const playBeep = () => new Promise((resolve) => {
  try {
    if (!audioContext || audioContext.state !== 'running') {
      initAudio();

      if (audioContext.state !== 'running') {
        resolve();
        return;
      }
    }

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
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
  } catch (error) {
    resolve();
  }
});
