const DING_FREQUENCY = 2000;
const DING_DURATION = 0.4;
const DING_VOLUME = 0.35;

export const executeDing = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(DING_FREQUENCY, context.currentTime);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(DING_FREQUENCY, context.currentTime);
  filter.Q.setValueAtTime(10, context.currentTime);

  gainNode.gain.setValueAtTime(DING_VOLUME, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + DING_DURATION);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + DING_DURATION);

  oscillator.onended = () => resolve();
};
