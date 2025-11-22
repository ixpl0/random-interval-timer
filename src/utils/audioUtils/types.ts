import type { SoundType } from '@/types';

export type ExtendedAudioContextState = AudioContext['state'] | 'interrupted';

export interface PendingSoundState {
  soundType: SoundType | null;
  volume: number;
  promise: Promise<void> | null;
  resolve: (() => void) | null;
  retryTimeoutId: ReturnType<typeof setTimeout> | null;
}

export const PENDING_RETRY_INTERVAL_MS = 500;

export const DEFAULT_VOLUME = 1;
