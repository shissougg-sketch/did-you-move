import { storyEmoteToPng, getStoryEmoteAnimation, EMOTES, type EmoteKey } from '../utils/emoteMapper';
import type { MobbleEmote as MobbleEmoteType } from '../types/story';

export type AnimationType = 'wobble' | 'bounce' | 'breathing' | 'sparkle' | 'float' | 'sparkle-bounce' | 'none';
export type EmoteSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface MobbleEmoteProps {
  /** Story emote type (maps to PNG automatically) */
  storyEmote?: MobbleEmoteType;
  /** Direct emote key (happy, happysmile, coy, etc.) */
  emote?: EmoteKey;
  /** Direct path to emote PNG */
  src?: string;
  /** Animation type */
  animation?: AnimationType;
  /** Auto-select animation based on story emote */
  autoAnimate?: boolean;
  /** Size of the emote */
  size?: EmoteSize;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
}

const sizeClasses: Record<EmoteSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

const animationClasses: Record<AnimationType, string> = {
  wobble: 'mobble-wobble',
  bounce: 'mobble-bounce',
  breathing: 'mobble-breathing',
  sparkle: 'mobble-sparkle',
  float: 'mobble-float',
  'sparkle-bounce': 'mobble-sparkle-bounce',
  none: '',
};

/**
 * Animated Mobble emote component
 *
 * Usage:
 * - With story emote: <MobbleEmote storyEmote="happy" />
 * - With emote key: <MobbleEmote emote="happysmile" />
 * - With direct path: <MobbleEmote src="/emotes/coy.png" />
 * - With animation: <MobbleEmote emote="winkwink" animation="sparkle" />
 * - Auto-animate: <MobbleEmote storyEmote="proud" autoAnimate />
 */
export const MobbleEmote = ({
  storyEmote,
  emote,
  src,
  animation,
  autoAnimate = false,
  size = 'md',
  className = '',
  alt = 'Mobble',
}: MobbleEmoteProps) => {
  // Determine the image source
  let imageSrc: string;
  if (src) {
    imageSrc = src;
  } else if (storyEmote) {
    imageSrc = storyEmoteToPng[storyEmote];
  } else if (emote) {
    imageSrc = EMOTES[emote];
  } else {
    imageSrc = EMOTES.happy; // Default fallback
  }

  // Determine animation class
  let animationClass = '';
  if (animation) {
    animationClass = animationClasses[animation];
  } else if (autoAnimate && storyEmote) {
    animationClass = getStoryEmoteAnimation(storyEmote);
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${sizeClasses[size]} object-contain ${animationClass} ${className}`}
      draggable={false}
    />
  );
};

export default MobbleEmote;
