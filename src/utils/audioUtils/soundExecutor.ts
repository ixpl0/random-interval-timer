import type { SoundType } from '@/types';
import { executeAlert } from './executeAlert';
import { executeBass } from './executeBass';
import { executeBeep } from './executeBeep';
import { executeChime } from './executeChime';
import { executeChirp } from './executeChirp';
import { executeDing } from './executeDing';
import { executeDrum } from './executeDrum';
import { executePulse } from './executePulse';
import { executeWhistle } from './executeWhistle';

const getRandomSoundType = (): SoundType => {
  const soundTypes: SoundType[] = ['beep', 'chime', 'alert', 'ding', 'whistle', 'chirp', 'pulse', 'bass', 'drum'];
  const randomIndex = Math.floor(Math.random() * soundTypes.length);

  return soundTypes[randomIndex];
};

export const executeSoundByType = (soundType: SoundType, context: AudioContext, resolve: () => void): void => {
  const actualSoundType = soundType === 'random' ? getRandomSoundType() : soundType;

  switch (actualSoundType) {
    case 'beep': {
      executeBeep(context, resolve);

      break;
    }

    case 'chime': {
      executeChime(context, resolve);

      break;
    }

    case 'alert': {
      executeAlert(context, resolve);

      break;
    }

    case 'ding': {
      executeDing(context, resolve);

      break;
    }

    case 'whistle': {
      executeWhistle(context, resolve);

      break;
    }

    case 'chirp': {
      executeChirp(context, resolve);

      break;
    }

    case 'pulse': {
      executePulse(context, resolve);

      break;
    }

    case 'bass': {
      executeBass(context, resolve);

      break;
    }

    case 'drum': {
      executeDrum(context, resolve);

      break;
    }

    default: {
      executeBeep(context, resolve);

      break;
    }
  }
};
