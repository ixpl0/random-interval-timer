const DRUM_FREQUENCY = 80;
const DRUM_DURATION = 0.4;
const DRUM_VOLUME = 5;
const DRUM_ATTACK_TIME = 0.01;
const DRUM_DECAY_TIME = 0.1;

export const executeDrum = (context: AudioContext, resolve: () => void): void => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();
  const convolver = context.createConvolver();
  const dryGain = context.createGain();
  const wetGain = context.createGain();

  // Create simple reverb impulse response
  const sampleRate = context.sampleRate;
  const length = sampleRate * 0.3; // 300ms reverb
  const impulse = context.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);

    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 2);

      channelData[i] = (Math.random() * 2 - 1) * decay * 0.3;
    }
  }

  convolver.buffer = impulse;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(DRUM_FREQUENCY, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(20, context.currentTime + DRUM_DECAY_TIME);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, context.currentTime);
  filter.Q.setValueAtTime(1, context.currentTime);

  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(DRUM_VOLUME, context.currentTime + DRUM_ATTACK_TIME);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + DRUM_DURATION);

  dryGain.gain.setValueAtTime(0.7, context.currentTime);
  wetGain.gain.setValueAtTime(0.3, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(dryGain);
  filter.connect(convolver);
  convolver.connect(wetGain);

  dryGain.connect(context.destination);
  wetGain.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + DRUM_DURATION);

  oscillator.onended = () => resolve();
};
