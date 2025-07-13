import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '../constants';

export const formatTime = (seconds) => {
  const h = Math.floor(seconds / SECONDS_PER_HOUR);
  const m = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const s = seconds % SECONDS_PER_MINUTE;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    return `${m}:${String(s).padStart(2, '0')}`;
  }
};

export const convertToSeconds = (hours, minutes, seconds) => {
  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
};

export const getRandomInt = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const validateTimeValue = (value, max) => {
  return Math.max(0, Math.min(value, max));
};
