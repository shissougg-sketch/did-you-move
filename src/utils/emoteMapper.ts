import type { MobbleEmote } from '../types/story';
import type { DailyEntry } from '../types/entry';

/**
 * Available emote PNG files in /public/Emotes/
 */
export const EMOTES = {
  happy: '/Emotes/happy.png',
  happysmile: '/Emotes/happysmile.png',
  coy: '/Emotes/coy.png',
  phew: '/Emotes/phew.png',
  tired: '/Emotes/tired.png',
  wegotthis: '/Emotes/wegotthis.png',
  winkwink: '/Emotes/winkwink.png',
} as const;

export type EmoteKey = keyof typeof EMOTES;

/**
 * Map story emotes to available PNG files
 */
export const storyEmoteToPng: Record<MobbleEmote, string> = {
  neutral: EMOTES.happy,
  happy: EMOTES.happysmile,
  tired: EMOTES.tired,
  proud: EMOTES.wegotthis,
  calm: EMOTES.happy,
  curious: EMOTES.coy,
  cozy: EMOTES.happysmile,
};

/**
 * Get the appropriate animation class for a story emote
 */
export const getStoryEmoteAnimation = (emote: MobbleEmote): string => {
  switch (emote) {
    case 'happy':
    case 'proud':
      return 'mobble-bounce';
    case 'tired':
      return 'mobble-breathing';
    case 'calm':
    case 'cozy':
      return 'mobble-breathing';
    case 'curious':
      return 'mobble-wobble';
    case 'neutral':
    default:
      return 'mobble-float';
  }
};

/**
 * Get emote PNG based on entry completion data
 */
export const getCompletionEmote = (entry: DailyEntry): string => {
  // Exhausting workout = phew relief
  if (entry.intensity === 'exhausting') {
    return EMOTES.phew;
  }

  // Hard workout = proud/we got this
  if (entry.intensity === 'hard') {
    return EMOTES.wegotthis;
  }

  // Based on movement status
  switch (entry.didMove) {
    case 'yes':
      return EMOTES.happysmile;
    case 'kind-of':
      return EMOTES.coy;
    case 'no':
      return EMOTES.tired;
    default:
      return EMOTES.happy;
  }
};

/**
 * Get the appropriate animation for a completion state
 */
export const getCompletionAnimation = (entry: DailyEntry): string => {
  if (entry.intensity === 'exhausting') {
    return 'mobble-breathing'; // Tired but accomplished
  }

  if (entry.didMove === 'yes' || entry.didMove === 'kind-of') {
    return 'mobble-bounce'; // Celebratory
  }

  return 'mobble-float'; // Gentle for rest days
};

/**
 * Get emote for points/rewards
 */
export const getRewardEmote = (): string => {
  return EMOTES.winkwink;
};

/**
 * Get emote for encouragement
 */
export const getEncouragementEmote = (): string => {
  return EMOTES.wegotthis;
};
