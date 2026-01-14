/**
 * Premium Story Pack Types
 *
 * Story packs are premium narrative content that can be:
 * - Included with Plus subscription
 * - Purchased individually
 * - Unlocked with lifetime purchase
 */

import type { StoryArc } from './story';

export interface StoryPack {
  id: string;
  name: string;
  description: string;
  price: number;  // USD price for individual purchase

  // Content
  arcs: StoryArc[];
  totalScenes: number;

  // Preview (one free scene to showcase the pack)
  previewSceneId: string | null;

  // Rewards for completing the pack
  rewards: {
    cosmetics: string[];  // Cosmetic IDs unlocked on completion
    titles: string[];     // Title strings earned
    points: number;       // Bonus points awarded
  };

  // Metadata
  releaseDate: string | null;  // ISO date, null if not yet released
  isComingSoon: boolean;
}

/**
 * Premium Story Packs
 *
 * These are placeholders showing the structure.
 * Actual content will be added when story writers create them.
 */
export const PREMIUM_STORY_PACKS: StoryPack[] = [
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Mobble discovers the wonders beneath the waves.',
    price: 3.99,
    arcs: [],  // Content to be added
    totalScenes: 15,
    previewSceneId: null,
    rewards: {
      cosmetics: ['coral-crown', 'bubble-effect'],
      titles: ['Deep Diver'],
      points: 100,
    },
    releaseDate: null,
    isComingSoon: true,
  },
  {
    id: 'mountain-summit',
    name: 'Mountain Summit',
    description: 'A challenging but rewarding climb to the peak.',
    price: 3.99,
    arcs: [],  // Content to be added
    totalScenes: 12,
    previewSceneId: null,
    rewards: {
      cosmetics: ['mountain-cap', 'snow-effect'],
      titles: ['Summit Seeker'],
      points: 100,
    },
    releaseDate: null,
    isComingSoon: true,
  },
  {
    id: 'cozy-village',
    name: 'Cozy Village',
    description: 'Mobble explores a warm, welcoming village.',
    price: 2.99,
    arcs: [],  // Content to be added
    totalScenes: 10,
    previewSceneId: null,
    rewards: {
      cosmetics: ['village-scarf', 'lantern-glow'],
      titles: ['Village Friend'],
      points: 75,
    },
    releaseDate: null,
    isComingSoon: true,
  },
];

/**
 * Get a story pack by ID
 */
export const getStoryPack = (packId: string): StoryPack | undefined => {
  return PREMIUM_STORY_PACKS.find(pack => pack.id === packId);
};

/**
 * Get all available (released) story packs
 */
export const getAvailableStoryPacks = (): StoryPack[] => {
  return PREMIUM_STORY_PACKS.filter(pack => !pack.isComingSoon);
};

/**
 * Get coming soon story packs
 */
export const getComingSoonStoryPacks = (): StoryPack[] => {
  return PREMIUM_STORY_PACKS.filter(pack => pack.isComingSoon);
};
