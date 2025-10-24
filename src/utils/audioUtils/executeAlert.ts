const ALERT_FREQUENCY = 800;
const ALERT_DURATION = 0.25;
const ALERT_VOLUME = 0.7;
const ALERT_WARBLE_SPEED = 8;
const ALERT_WARBLE_DEPTH = 200;

export const executeAlert = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(ALERT_FREQUENCY, context.currentTime);

  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(ALERT_WARBLE_SPEED, context.currentTime);
  lfoGain.gain.setValueAtTime(ALERT_WARBLE_DEPTH, context.currentTime);

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);

  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(ALERT_VOLUME, context.currentTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + ALERT_DURATION);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  lfo.start(context.currentTime);
  oscillator.stop(context.currentTime + ALERT_DURATION);
  lfo.stop(context.currentTime + ALERT_DURATION);

  oscillator.onended = () => resolve();
};
