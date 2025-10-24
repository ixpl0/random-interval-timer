const BASS_FREQUENCY = 120;
const BASS_DURATION = 0.35;
const BASS_VOLUME = 3;
const BASS_HARMONIC_FREQ = 240;

export const executeBass = (context: AudioContext, resolve: () => void): void => {
  const oscillator1 = context.createOscillator();
  const oscillator2 = context.createOscillator();
  const gainNode1 = context.createGain();
  const gainNode2 = context.createGain();
  const masterGain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator1.type = 'sawtooth';
  oscillator1.frequency.setValueAtTime(BASS_FREQUENCY, context.currentTime);

  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(BASS_HARMONIC_FREQ, context.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, context.currentTime);
  filter.Q.setValueAtTime(1, context.currentTime);

  gainNode1.gain.setValueAtTime(BASS_VOLUME, context.currentTime);
  gainNode1.gain.exponentialRampToValueAtTime(0.001, context.currentTime + BASS_DURATION);

  gainNode2.gain.setValueAtTime(BASS_VOLUME * 0.3, context.currentTime);
  gainNode2.gain.exponentialRampToValueAtTime(0.001, context.currentTime + BASS_DURATION);

  masterGain.gain.setValueAtTime(0.8, context.currentTime);

  oscillator1.connect(gainNode1);
  oscillator2.connect(gainNode2);
  gainNode1.connect(filter);
  gainNode2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(context.destination);

  oscillator1.start(context.currentTime);
  oscillator2.start(context.currentTime);
  oscillator1.stop(context.currentTime + BASS_DURATION);
  oscillator2.stop(context.currentTime + BASS_DURATION);

  oscillator1.onended = () => resolve();
};
