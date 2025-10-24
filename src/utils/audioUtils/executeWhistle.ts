const WHISTLE_FREQUENCY = 1500;
const WHISTLE_DURATION = 0.3;
const WHISTLE_VOLUME = 1.8;
const WHISTLE_SWEEP_END = 2200;

export const executeWhistle = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(WHISTLE_FREQUENCY, context.currentTime);
  oscillator.frequency.linearRampToValueAtTime(WHISTLE_SWEEP_END, context.currentTime + WHISTLE_DURATION * 0.6);
  oscillator.frequency.linearRampToValueAtTime(WHISTLE_FREQUENCY, context.currentTime + WHISTLE_DURATION);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(WHISTLE_FREQUENCY, context.currentTime);
  filter.Q.setValueAtTime(8, context.currentTime);

  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(WHISTLE_VOLUME, context.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + WHISTLE_DURATION);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + WHISTLE_DURATION);

  oscillator.onended = () => resolve();
};
