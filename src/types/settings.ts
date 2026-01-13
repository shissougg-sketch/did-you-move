export type Tone = 'gentle' | 'neutral' | 'direct';

export interface UserSettings {
  tone: Tone;
  showTrends: boolean;
  healthkitConnected: boolean; // For Phase 2
  healthkitSyncEnabled: boolean; // For Phase 2
  calorieThresholds: {
    yes: number; // default 150
    kindOf: number; // default 50
  };
  // Points and cosmetics system
  totalPoints: number;
  pointsSpent: number;
  cosmeticsOwned: string[];
  equippedCosmetic: string | null;
}

export const DEFAULT_SETTINGS: UserSettings = {
  tone: 'gentle',
  showTrends: true,
  healthkitConnected: false,
  healthkitSyncEnabled: false,
  calorieThresholds: {
    yes: 150,
    kindOf: 50,
  },
  totalPoints: 0,
  pointsSpent: 0,
  cosmeticsOwned: [],
  equippedCosmetic: null,
};
