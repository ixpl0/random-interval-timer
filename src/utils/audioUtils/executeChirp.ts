const CHIRP_START_FREQUENCY = 400;
const CHIRP_END_FREQUENCY = 1200;
const CHIRP_DURATION = 0.2;

export const executeChirp = (context: AudioContext, volume: number, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(CHIRP_START_FREQUENCY, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(CHIRP_END_FREQUENCY, context.currentTime + CHIRP_DURATION);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, context.currentTime);
  filter.Q.setValueAtTime(2, context.currentTime);

  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + CHIRP_DURATION);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + CHIRP_DURATION);

  oscillator.onended = () => resolve();
};
