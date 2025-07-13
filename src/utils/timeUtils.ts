import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '@/constants';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;

  if (hours > 0) {
    return `${hours}:${minutes.toString()
      .padStart(2, '0')}:${remainingSeconds.toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString()
    .padStart(2, '0')}`;
};

export const convertToSeconds = (hours: number, minutes: number, seconds: number): number => {
  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const validateTimeValue = (value: number, max: number): number => {
  if (isNaN(value) || value < 0) {
    return 0;
  }

  if (value > max) {
    return max;
  }

  return Math.floor(value);
};
