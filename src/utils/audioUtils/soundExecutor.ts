import type { SoundType } from '@/types';
import { executeAlert } from './executeAlert';
import { executeBeep } from './executeBeep';
import { executeChime } from './executeChime';
import { executeChirp } from './executeChirp';
import { executeDing } from './executeDing';
import { executePulse } from './executePulse';
import { executeWhistle } from './executeWhistle';

const getRandomSoundType = (): SoundType => {
  const soundTypes: SoundType[] = ['beep', 'chime', 'alert', 'ding', 'whistle', 'chirp', 'pulse'];
  const randomIndex = Math.floor(Math.random() * soundTypes.length);

  return soundTypes[randomIndex];
};

export const executeSoundByType = (soundType: SoundType, context: AudioContext, volume: number, resolve: () => void): void => {
  const actualSoundType = soundType === 'random' ? getRandomSoundType() : soundType;

  switch (actualSoundType) {
    case 'beep': {
      executeBeep(context, volume, resolve);

      break;
    }

    case 'chime': {
      executeChime(context, volume, resolve);

      break;
    }

    case 'alert': {
      executeAlert(context, volume, resolve);

      break;
    }

    case 'ding': {
      executeDing(context, volume, resolve);

      break;
    }

    case 'whistle': {
      executeWhistle(context, volume, resolve);

      break;
    }

    case 'chirp': {
      executeChirp(context, volume, resolve);

      break;
    }

    case 'pulse': {
      executePulse(context, volume, resolve);

      break;
    }

    default: {
      executeBeep(context, volume, resolve);

      break;
    }
  }
};
