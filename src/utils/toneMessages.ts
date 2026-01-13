import type { Tone } from '../types/settings';

export const getToneMessage = (tone: Tone): string => {
  switch (tone) {
    case 'gentle':
      return 'Anything counts. Even stretching. Even a walk.';
    case 'neutral':
      return 'Did you move today?';
    case 'direct':
      return 'Did you do anything physical?';
  }
};

export const getCompletionMessage = (tone: Tone): string => {
  switch (tone) {
    case 'gentle':
      return "You're done for today ✓";
    case 'neutral':
      return "Today's entry complete";
    case 'direct':
      return 'Logged';
  }
};
