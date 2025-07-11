let audioContext = null;

const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

const playBeep = () => new Promise((resolve) => {
  try {
    if (!audioContext || audioContext.state !== 'running') {
      initAudio();

      if (audioContext.state !== 'running') {
        console.error('AudioContext is not running, cannot play beep');
        resolve();

        return;
      }
    }

    const oscillator = audioContext.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.10);
    gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.10);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.10);
    oscillator.onended = () => resolve();
  } catch (error) {
    resolve();
  }
});

module.exports = { initAudio, playBeep };
