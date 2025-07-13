import type { Timeout } from '@/types';
import { MILLISECONDS_PER_SECOND } from '@/constants';

export const createAccurateTimer = (callback: () => void, interval = MILLISECONDS_PER_SECOND): (() => void) => {
  let expected = Date.now() + interval;
  let timeoutId: Timeout;

  const step = (): void => {
    const drift = Date.now() - expected;

    callback();
    expected += interval;
    timeoutId = setTimeout(step, Math.max(0, interval - drift));
  };

  timeoutId = setTimeout(step, interval);

  return (): void => {
    clearTimeout(timeoutId);
  };
};
