const BEEP_FREQUENCY = 1000;
const BEEP_DURATION = 0.1;
const BEEP_VOLUME = 0.7;
const FILTER_FREQUENCY = 1800;

export const executeBeep = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(BEEP_FREQUENCY, context.currentTime);

  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(FILTER_FREQUENCY, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(context.destination);

  gainNode.gain.setValueAtTime(BEEP_VOLUME, context.currentTime);
  gainNode.gain.setValueAtTime(BEEP_VOLUME, context.currentTime + BEEP_DURATION);
  gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + BEEP_DURATION);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + BEEP_DURATION);
  oscillator.onended = resolve;
};
