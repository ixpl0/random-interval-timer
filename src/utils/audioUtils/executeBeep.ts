import { logSound } from '@/utils/logger';

const BEEP_FREQUENCY = 1000;
const BEEP_DURATION = 0.1;
const BEEP_VOLUME = 0.3;
const FILTER_FREQUENCY = 1800;

export const executeBeep = (context: AudioContext, resolve: () => void): void => {
  const destinationChannels = context.destination.maxChannelCount;
  const sampleRate = context.sampleRate;

  logSound(`executeBeep: state=${context.state}, time=${context.currentTime.toFixed(3)}, channels=${destinationChannels}, sampleRate=${sampleRate}`);

  if (context.state !== 'running') {
    logSound('executeBeep: WARNING - context not running!');
  }

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

  const currentGain = gainNode.gain.value;

  logSound(`executeBeep: initial gain=${currentGain}`);

  gainNode.gain.setValueAtTime(BEEP_VOLUME, context.currentTime);
  gainNode.gain.setValueAtTime(BEEP_VOLUME, context.currentTime + BEEP_DURATION);
  gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + BEEP_DURATION);

  const startTime = context.currentTime;
  const stopTime = context.currentTime + BEEP_DURATION;

  logSound(`executeBeep: scheduling start=${startTime.toFixed(3)}, stop=${stopTime.toFixed(3)}, volume=${BEEP_VOLUME}`);

  oscillator.start(startTime);
  oscillator.stop(stopTime);
  oscillator.onended = () => {
    logSound(`executeBeep: onended at ${context.currentTime.toFixed(3)}`);
    resolve();
  };
};
