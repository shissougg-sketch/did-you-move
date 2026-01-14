import type { UserProfile } from './profile';
import { DEFAULT_PROFILE } from './profile';

export type Tone = 'gentle' | 'neutral' | 'direct';

/**
 * Note: Subscription data is managed separately in subscriptionStore.ts
 * This keeps concerns separated and allows subscription state to be
 * synced with payment providers independently.
 */

export interface ReminderPreferences {
  enabled: boolean;
  time: string; // "18:00" format (24-hour)
  fcmToken: string | null;
}

export type SyncFrequency = 'daily' | 'every-other-day' | 'on-open';

export interface HealthKitPreferences {
  connected: boolean;
  syncEnabled: boolean;
  syncFrequency: SyncFrequency;
  lastSyncAt: string | null;
}

export interface UserSettings {
  tone: Tone;
  showTrends: boolean;
  // HealthKit integration
  healthkit: HealthKitPreferences;
  calorieThresholds: {
    yes: number; // default 150
    kindOf: number; // default 50
  };
  // Push notification reminders
  reminders: ReminderPreferences;
  // User profile for BMR calculation
  profile: UserProfile;
  // Points and cosmetics system
  totalPoints: number;
  pointsSpent: number;
  cosmeticsOwned: string[];
  equippedCosmetic: string | null;
  // First-time walkthrough
  walkthroughCompleted: boolean;
  // Redeemed codes
  redeemedCodes: string[];
}

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  enabled: false,
  time: '18:00', // 6:00 PM default
  fcmToken: null,
};

export const DEFAULT_HEALTHKIT_PREFERENCES: HealthKitPreferences = {
  connected: false,
  syncEnabled: false,
  syncFrequency: 'on-open',
  lastSyncAt: null,
};

export const DEFAULT_SETTINGS: UserSettings = {
  tone: 'gentle',
  showTrends: true,
  healthkit: DEFAULT_HEALTHKIT_PREFERENCES,
  calorieThresholds: {
    yes: 150,
    kindOf: 50,
  },
  reminders: DEFAULT_REMINDER_PREFERENCES,
  profile: DEFAULT_PROFILE,
  totalPoints: 0,
  pointsSpent: 0,
  cosmeticsOwned: [],
  equippedCosmetic: null,
  walkthroughCompleted: false,
  redeemedCodes: [],
};
