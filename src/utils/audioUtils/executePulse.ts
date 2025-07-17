const PULSE_FREQUENCY = 600;
const PULSE_DURATION = 0.3;
const PULSE_VOLUME = 0.45;
const PULSE_RATE = 12;

export const executePulse = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(PULSE_FREQUENCY, context.currentTime);

  lfo.type = 'square';
  lfo.frequency.setValueAtTime(PULSE_RATE, context.currentTime);
  lfoGain.gain.setValueAtTime(PULSE_VOLUME / 2, context.currentTime);

  lfo.connect(lfoGain);
  lfoGain.connect(gainNode.gain);

  gainNode.gain.setValueAtTime(PULSE_VOLUME / 2, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + PULSE_DURATION);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  lfo.start(context.currentTime);
  oscillator.stop(context.currentTime + PULSE_DURATION);
  lfo.stop(context.currentTime + PULSE_DURATION);

  oscillator.onended = () => resolve();
};
