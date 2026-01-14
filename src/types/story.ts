/**
 * Story Mode Types
 *
 * Mobble's journey - a gentle, unlock-based progression system.
 * No penalties, no streaks, just forward movement.
 */

export type MobbleEmote = 'neutral' | 'happy' | 'tired' | 'proud' | 'calm' | 'curious' | 'cozy';

export interface StoryScene {
  id: string;
  title: string;
  description: string; // Short, gentle micro-text
  mobbleEmote: MobbleEmote;
  backgroundKey: string; // Key for background illustration
  unlockedAt?: string; // ISO timestamp when unlocked
}

export interface StoryArc {
  id: string;
  name: string;
  description: string;
  scenes: StoryScene[];
  totalSteps: number; // Total check-ins needed to complete arc
}

export interface SidePath {
  id: string;
  name: string;
  description: string;
  pointsCost: number; // Points to unlock
  scenes: StoryScene[];
  reward?: {
    type: 'cosmetic' | 'title';
    id: string;
    name: string;
  };
}

export interface StoryProgress {
  currentArcId: string;
  currentSceneIndex: number; // Which scene we're on (0-indexed)
  totalCheckIns: number; // Lifetime check-ins (never decreases)
  checkInsThisArc: number; // Check-ins in current arc
  unlockedScenes: string[]; // Scene IDs that have been unlocked
  completedArcs: string[]; // Arc IDs that have been completed
  unlockedSidePaths: string[]; // Side path IDs unlocked with points
  completedSidePaths: string[]; // Side paths fully explored
  lastCheckInDate: string | null; // For tracking, not for penalties
  journeyStartedAt: string | null;
}

export const DEFAULT_STORY_PROGRESS: StoryProgress = {
  currentArcId: 'the-path',
  currentSceneIndex: 0,
  totalCheckIns: 0,
  checkInsThisArc: 0,
  unlockedScenes: [],
  completedArcs: [],
  unlockedSidePaths: [],
  completedSidePaths: [],
  lastCheckInDate: null,
  journeyStartedAt: null,
};

/**
 * Side Paths - Optional journeys unlocked with points
 * These are bonus content, not required for main progression
 */
export const SIDE_PATHS: SidePath[] = [
  {
    id: 'stargazing',
    name: 'Stargazing Spot',
    description: 'A quiet detour to watch the night sky.',
    pointsCost: 50,
    scenes: [
      {
        id: 'stars-climb',
        title: 'Night Climb',
        description: 'Mobble finds a hill as the sun sets.',
        mobbleEmote: 'curious',
        backgroundKey: 'stars-hill',
      },
      {
        id: 'stars-blanket',
        title: 'Settling In',
        description: 'Mobble lays out a cozy blanket.',
        mobbleEmote: 'cozy',
        backgroundKey: 'stars-blanket',
      },
      {
        id: 'stars-watching',
        title: 'Infinite Wonder',
        description: 'So many stars. Mobble feels small, but in a good way.',
        mobbleEmote: 'calm',
        backgroundKey: 'stars-sky',
      },
    ],
    reward: {
      type: 'cosmetic',
      id: 'star-crown',
      name: 'Star Crown',
    },
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day',
    description: 'Sometimes the best journeys happen in the rain.',
    pointsCost: 75,
    scenes: [
      {
        id: 'rain-start',
        title: 'First Drops',
        description: 'Mobble feels a drop on their head.',
        mobbleEmote: 'curious',
        backgroundKey: 'rain-start',
      },
      {
        id: 'rain-puddles',
        title: 'Puddle Hopping',
        description: 'Mobble discovers the joy of splashing.',
        mobbleEmote: 'happy',
        backgroundKey: 'rain-puddles',
      },
      {
        id: 'rain-shelter',
        title: 'A Dry Spot',
        description: 'Mobble finds shelter and listens to the rain.',
        mobbleEmote: 'cozy',
        backgroundKey: 'rain-shelter',
      },
      {
        id: 'rain-rainbow',
        title: 'After the Storm',
        description: 'A rainbow appears. Worth getting a little wet.',
        mobbleEmote: 'proud',
        backgroundKey: 'rain-rainbow',
      },
    ],
    reward: {
      type: 'cosmetic',
      id: 'rain-boots',
      name: 'Rain Boots',
    },
  },
  {
    id: 'cozy-cabin',
    name: 'The Cozy Cabin',
    description: 'A warm cabin hidden in the woods.',
    pointsCost: 100,
    scenes: [
      {
        id: 'cabin-find',
        title: 'Smoke in the Distance',
        description: 'Mobble spots chimney smoke through the trees.',
        mobbleEmote: 'curious',
        backgroundKey: 'cabin-smoke',
      },
      {
        id: 'cabin-approach',
        title: 'A Warm Welcome',
        description: 'The cabin looks inviting. Nobody\'s home, but the door is open.',
        mobbleEmote: 'calm',
        backgroundKey: 'cabin-door',
      },
      {
        id: 'cabin-fire',
        title: 'By the Fire',
        description: 'Mobble warms up by the crackling fireplace.',
        mobbleEmote: 'cozy',
        backgroundKey: 'cabin-fire',
      },
      {
        id: 'cabin-cocoa',
        title: 'Hot Cocoa',
        description: 'Someone left cocoa on the stove. How thoughtful.',
        mobbleEmote: 'happy',
        backgroundKey: 'cabin-cocoa',
      },
      {
        id: 'cabin-rest',
        title: 'A Good Rest',
        description: 'Mobble takes a well-deserved nap. You\'ve both earned it.',
        mobbleEmote: 'cozy',
        backgroundKey: 'cabin-nap',
      },
    ],
    reward: {
      type: 'cosmetic',
      id: 'cozy-blanket',
      name: 'Cozy Blanket',
    },
  },
];

/**
 * Story Content
 *
 * Arc 1: "The Path" - Mobble's first journey
 * A gentle hill with a cozy resting spot at the top.
 */
export const STORY_ARCS: StoryArc[] = [
  {
    id: 'the-path',
    name: 'The Path',
    description: 'Mobble notices a gentle path leading somewhere peaceful.',
    totalSteps: 7,
    scenes: [
      {
        id: 'path-start',
        title: 'A New Beginning',
        description: 'Mobble notices a gentle path ahead. It looks inviting.',
        mobbleEmote: 'curious',
        backgroundKey: 'path-start',
      },
      {
        id: 'path-first-steps',
        title: 'First Steps',
        description: 'Mobble took a small step today. The path feels right.',
        mobbleEmote: 'happy',
        backgroundKey: 'path-walking',
      },
      {
        id: 'path-moving',
        title: 'Finding Rhythm',
        description: 'Mobble is starting to enjoy the journey.',
        mobbleEmote: 'calm',
        backgroundKey: 'path-meadow',
      },
      {
        id: 'path-halfway',
        title: 'Halfway There',
        description: 'Mobble paused to look back. Look how far you\'ve come.',
        mobbleEmote: 'proud',
        backgroundKey: 'path-viewpoint',
      },
      {
        id: 'path-tired',
        title: 'A Moment to Rest',
        description: 'Mobble found a nice spot to catch their breath.',
        mobbleEmote: 'tired',
        backgroundKey: 'path-resting',
      },
      {
        id: 'path-almost',
        title: 'Almost There',
        description: 'Mobble can see something warm ahead.',
        mobbleEmote: 'curious',
        backgroundKey: 'path-approaching',
      },
      {
        id: 'path-complete',
        title: 'A Cozy Spot',
        description: 'Mobble found a peaceful resting place. You helped them get here.',
        mobbleEmote: 'cozy',
        backgroundKey: 'path-destination',
      },
    ],
  },
  {
    id: 'the-garden',
    name: 'The Garden',
    description: 'Beyond the path, Mobble discovers a gentle garden.',
    totalSteps: 10,
    scenes: [
      {
        id: 'garden-discover',
        title: 'A Hidden Gate',
        description: 'Mobble spots an old garden gate. Wonder what\'s inside?',
        mobbleEmote: 'curious',
        backgroundKey: 'garden-gate',
      },
      {
        id: 'garden-enter',
        title: 'Stepping In',
        description: 'The garden is quiet and welcoming.',
        mobbleEmote: 'calm',
        backgroundKey: 'garden-entrance',
      },
      {
        id: 'garden-flowers',
        title: 'First Blooms',
        description: 'Mobble notices tiny flowers starting to grow.',
        mobbleEmote: 'happy',
        backgroundKey: 'garden-flowers',
      },
      {
        id: 'garden-bench',
        title: 'A Quiet Bench',
        description: 'A perfect spot to sit and breathe.',
        mobbleEmote: 'cozy',
        backgroundKey: 'garden-bench',
      },
      {
        id: 'garden-pond',
        title: 'Still Waters',
        description: 'Mobble found a small pond. The water is calm.',
        mobbleEmote: 'calm',
        backgroundKey: 'garden-pond',
      },
      {
        id: 'garden-butterflies',
        title: 'Visitors',
        description: 'Butterflies seem to like Mobble\'s company.',
        mobbleEmote: 'happy',
        backgroundKey: 'garden-butterflies',
      },
      {
        id: 'garden-sunset',
        title: 'Golden Hour',
        description: 'The garden glows in the evening light.',
        mobbleEmote: 'proud',
        backgroundKey: 'garden-sunset',
      },
      {
        id: 'garden-growing',
        title: 'Growing Together',
        description: 'The flowers are blooming more each day. So is Mobble.',
        mobbleEmote: 'happy',
        backgroundKey: 'garden-blooming',
      },
      {
        id: 'garden-rest',
        title: 'Tired but Happy',
        description: 'Mobble worked hard today. Time for a break.',
        mobbleEmote: 'tired',
        backgroundKey: 'garden-hammock',
      },
      {
        id: 'garden-complete',
        title: 'A Garden Home',
        description: 'This garden feels like it belongs to Mobble now. You made this happen.',
        mobbleEmote: 'cozy',
        backgroundKey: 'garden-home',
      },
    ],
  },
  {
    id: 'the-lighthouse',
    name: 'The Lighthouse',
    description: 'A distant light calls Mobble toward the coast.',
    totalSteps: 12,
    scenes: [
      {
        id: 'lighthouse-glimpse',
        title: 'A Distant Light',
        description: 'Mobble sees something glowing far away.',
        mobbleEmote: 'curious',
        backgroundKey: 'lighthouse-distant',
      },
      {
        id: 'lighthouse-coast',
        title: 'The Coast',
        description: 'Mobble reaches the shore. The air smells like salt.',
        mobbleEmote: 'calm',
        backgroundKey: 'lighthouse-shore',
      },
      {
        id: 'lighthouse-waves',
        title: 'Watching Waves',
        description: 'Mobble sits and watches the waves for a while.',
        mobbleEmote: 'cozy',
        backgroundKey: 'lighthouse-waves',
      },
      {
        id: 'lighthouse-path',
        title: 'A Rocky Path',
        description: 'The path to the lighthouse is a bit tricky.',
        mobbleEmote: 'tired',
        backgroundKey: 'lighthouse-rocks',
      },
      {
        id: 'lighthouse-closer',
        title: 'Getting Closer',
        description: 'The lighthouse grows bigger with each step.',
        mobbleEmote: 'happy',
        backgroundKey: 'lighthouse-approach',
      },
      {
        id: 'lighthouse-door',
        title: 'The Door',
        description: 'Mobble stands at the lighthouse entrance.',
        mobbleEmote: 'curious',
        backgroundKey: 'lighthouse-door',
      },
      {
        id: 'lighthouse-stairs',
        title: 'Climbing Up',
        description: 'So many stairs! But Mobble keeps going.',
        mobbleEmote: 'tired',
        backgroundKey: 'lighthouse-stairs',
      },
      {
        id: 'lighthouse-window',
        title: 'A Window View',
        description: 'Mobble pauses to look out. Beautiful.',
        mobbleEmote: 'calm',
        backgroundKey: 'lighthouse-window',
      },
      {
        id: 'lighthouse-almost',
        title: 'Almost at the Top',
        description: 'Just a few more steps.',
        mobbleEmote: 'proud',
        backgroundKey: 'lighthouse-near-top',
      },
      {
        id: 'lighthouse-top',
        title: 'The Top',
        description: 'Mobble made it. The view is incredible.',
        mobbleEmote: 'happy',
        backgroundKey: 'lighthouse-top',
      },
      {
        id: 'lighthouse-light',
        title: 'The Light',
        description: 'Mobble watches the light spin. It guides others home.',
        mobbleEmote: 'proud',
        backgroundKey: 'lighthouse-light',
      },
      {
        id: 'lighthouse-complete',
        title: 'A Guiding Light',
        description: 'Mobble found their beacon. You helped light the way.',
        mobbleEmote: 'cozy',
        backgroundKey: 'lighthouse-complete',
      },
    ],
  },
];

/**
 * Get the current arc
 */
export const getCurrentArc = (arcId: string): StoryArc | undefined => {
  return STORY_ARCS.find(arc => arc.id === arcId);
};

/**
 * Get the next arc after completing one
 */
export const getNextArc = (currentArcId: string): StoryArc | undefined => {
  const currentIndex = STORY_ARCS.findIndex(arc => arc.id === currentArcId);
  if (currentIndex === -1 || currentIndex >= STORY_ARCS.length - 1) {
    return undefined;
  }
  return STORY_ARCS[currentIndex + 1];
};

/**
 * Calculate which scene should be unlocked based on check-ins
 */
export const calculateSceneIndex = (checkIns: number, arc: StoryArc): number => {
  if (checkIns === 0) return 0;

  // Distribute check-ins across scenes
  const stepsPerScene = arc.totalSteps / arc.scenes.length;
  const sceneIndex = Math.floor(checkIns / stepsPerScene);

  // Cap at the last scene
  return Math.min(sceneIndex, arc.scenes.length - 1);
};

/**
 * Get encouraging micro-text based on Mobble's state
 */
export const getMobbleMessage = (emote: MobbleEmote): string => {
  const messages: Record<MobbleEmote, string[]> = {
    neutral: ['Mobble is here with you.', 'Mobble is waiting patiently.'],
    happy: ['Mobble is glad you\'re here!', 'Mobble feels good today.'],
    tired: ['Mobble is taking it easy.', 'Rest is part of the journey.'],
    proud: ['Mobble is proud of you.', 'Look how far you\'ve come.'],
    calm: ['Mobble feels peaceful.', 'A quiet moment together.'],
    curious: ['Mobble wonders what\'s next.', 'Adventure awaits.'],
    cozy: ['Mobble feels at home.', 'This is a good place.'],
  };

  const options = messages[emote];
  return options[Math.floor(Math.random() * options.length)];
};
