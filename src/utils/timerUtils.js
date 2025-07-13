import { MILLISECONDS_PER_SECOND } from '../constants';

export const createAccurateTimer = (callback) => {
  const start = Date.now();
  let stopped = false;
  let count = 0;

  const tick = () => {
    if (stopped) {
      return;
    }

    count += 1;
    callback();

    const expected = start + count * MILLISECONDS_PER_SECOND;
    const drift = Date.now() - expected;

    setTimeout(tick, Math.max(0, MILLISECONDS_PER_SECOND - drift));
  };

  const timeoutId = setTimeout(tick, MILLISECONDS_PER_SECOND);

  return () => {
    stopped = true;
    clearTimeout(timeoutId);
  };
};
