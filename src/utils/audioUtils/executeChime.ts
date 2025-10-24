const CHIME_FREQUENCIES = [523.25, 659.25, 783.99]; // C5, E5, G5
const CHIME_DURATION = 0.2;
const CHIME_VOLUME = 0.8;
const CHIME_ATTACK_TIME = 0.01;
const CHIME_RELEASE_TIME = 0.1;

export const executeChime = (context: AudioContext, resolve: () => void): void => {
  const masterGain = context.createGain();

  masterGain.connect(context.destination);
  masterGain.gain.setValueAtTime(CHIME_VOLUME, context.currentTime);

  let completedOscillators = 0;
  const totalOscillators = CHIME_FREQUENCIES.length;

  CHIME_FREQUENCIES.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    const startTime = context.currentTime + (index * 0.05);
    const endTime = startTime + CHIME_DURATION;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + CHIME_ATTACK_TIME);
    gainNode.gain.linearRampToValueAtTime(0, endTime - CHIME_RELEASE_TIME);

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.start(startTime);
    oscillator.stop(endTime);

    oscillator.onended = () => {
      completedOscillators++;

      if (completedOscillators === totalOscillators) {
        resolve();
      }
    };
  });
};
