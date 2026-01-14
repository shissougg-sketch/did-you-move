import { create } from 'zustand';
import type { UserSettings, Tone, ReminderPreferences, HealthKitPreferences, SyncFrequency } from '../types/settings';
import type { UserProfile } from '../types/profile';
import { loadSettings, saveSettings } from '../utils/localStorage';
import { calculateBMR, getTDEEForLevel, estimateAverageWeight } from '../utils/bmrCalculator';

interface SettingsStore {
  settings: UserSettings;
  loadSettings: () => void;
  updateTone: (tone: Tone) => void;
  toggleTrends: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  // Reminder methods
  updateReminders: (updates: Partial<ReminderPreferences>) => void;
  enableReminders: (fcmToken: string) => void;
  disableReminders: () => void;
  setReminderTime: (time: string) => void;
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeProfileSetup: (profile: Partial<UserProfile>) => void;
  isProfileComplete: () => boolean;
  // HealthKit methods
  updateHealthKit: (updates: Partial<HealthKitPreferences>) => void;
  connectHealthKit: () => void;
  disconnectHealthKit: () => void;
  setSyncFrequency: (frequency: SyncFrequency) => void;
  updateLastSync: () => void;
  // Points and cosmetics methods
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  getAvailablePoints: () => number;
  buyCosmetic: (cosmeticId: string, price: number) => boolean;
  equipCosmetic: (cosmeticId: string | null) => void;
  ownsCosmetic: (cosmeticId: string) => boolean;
  // Walkthrough methods
  completeWalkthrough: () => void;
  hasCompletedWalkthrough: () => boolean;
  // Code redemption methods
  redeemCode: (code: string) => { success: boolean; message: string; points?: number };
  hasRedeemedCode: (code: string) => boolean;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: loadSettings(),

  loadSettings: () => {
    const settings = loadSettings();
    set({ settings });
  },

  updateTone: (tone) => {
    const settings = { ...get().settings, tone };
    saveSettings(settings);
    set({ settings });
  },

  toggleTrends: () => {
    const settings = { ...get().settings, showTrends: !get().settings.showTrends };
    saveSettings(settings);
    set({ settings });
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    saveSettings(settings);
    set({ settings });
  },

  // Reminder methods
  updateReminders: (updates) => {
    const settings = {
      ...get().settings,
      reminders: { ...get().settings.reminders, ...updates },
    };
    saveSettings(settings);
    set({ settings });
  },

  enableReminders: (fcmToken) => {
    const settings = {
      ...get().settings,
      reminders: { ...get().settings.reminders, enabled: true, fcmToken },
    };
    saveSettings(settings);
    set({ settings });
  },

  disableReminders: () => {
    const settings = {
      ...get().settings,
      reminders: { ...get().settings.reminders, enabled: false },
    };
    saveSettings(settings);
    set({ settings });
  },

  setReminderTime: (time) => {
    const settings = {
      ...get().settings,
      reminders: { ...get().settings.reminders, time },
    };
    saveSettings(settings);
    set({ settings });
  },

  // Profile methods
  updateProfile: (updates) => {
    const currentProfile = get().settings.profile;
    const newProfile = { ...currentProfile, ...updates, updatedAt: new Date().toISOString() };

    // Get weight for BMR calculation (use estimate if prefer not to say)
    let weightForCalc = newProfile.weightKg;
    if (newProfile.weightPreferNotToSay && newProfile.heightCm && newProfile.biologicalSex) {
      weightForCalc = estimateAverageWeight(newProfile.heightCm, newProfile.biologicalSex);
    }

    // Recalculate BMR if relevant fields available
    if (newProfile.age && newProfile.heightCm && weightForCalc && newProfile.biologicalSex) {
      newProfile.bmr = calculateBMR(
        weightForCalc,
        newProfile.heightCm,
        newProfile.age,
        newProfile.biologicalSex
      );
      // Calculate TDEE if we have activity level
      newProfile.tdee = getTDEEForLevel(newProfile.bmr, newProfile.activityLevel);
    }

    const settings = {
      ...get().settings,
      profile: newProfile,
    };
    saveSettings(settings);
    set({ settings });
  },

  completeProfileSetup: (profile) => {
    const now = new Date().toISOString();
    const newProfile = {
      ...get().settings.profile,
      ...profile,
      setupCompletedAt: now,
      updatedAt: now,
    };

    // Get weight for BMR calculation (use estimate if prefer not to say)
    let weightForCalc = newProfile.weightKg;
    if (newProfile.weightPreferNotToSay && newProfile.heightCm && newProfile.biologicalSex) {
      weightForCalc = estimateAverageWeight(newProfile.heightCm, newProfile.biologicalSex);
    }

    // Calculate BMR if we have all required fields
    if (newProfile.age && newProfile.heightCm && weightForCalc && newProfile.biologicalSex) {
      newProfile.bmr = calculateBMR(
        weightForCalc,
        newProfile.heightCm,
        newProfile.age,
        newProfile.biologicalSex
      );
      // Calculate TDEE if we have activity level
      newProfile.tdee = getTDEEForLevel(newProfile.bmr, newProfile.activityLevel);
    }

    const settings = {
      ...get().settings,
      profile: newProfile,
    };
    saveSettings(settings);
    set({ settings });
  },

  isProfileComplete: () => {
    const { profile } = get().settings;
    return profile.setupCompletedAt !== null;
  },

  // HealthKit methods
  updateHealthKit: (updates) => {
    const settings = {
      ...get().settings,
      healthkit: { ...get().settings.healthkit, ...updates },
    };
    saveSettings(settings);
    set({ settings });
  },

  connectHealthKit: () => {
    const settings = {
      ...get().settings,
      healthkit: { ...get().settings.healthkit, connected: true, syncEnabled: true },
    };
    saveSettings(settings);
    set({ settings });
  },

  disconnectHealthKit: () => {
    const settings = {
      ...get().settings,
      healthkit: {
        ...get().settings.healthkit,
        connected: false,
        syncEnabled: false,
        lastSyncAt: null,
      },
    };
    saveSettings(settings);
    set({ settings });
  },

  setSyncFrequency: (frequency) => {
    const settings = {
      ...get().settings,
      healthkit: { ...get().settings.healthkit, syncFrequency: frequency },
    };
    saveSettings(settings);
    set({ settings });
  },

  updateLastSync: () => {
    const settings = {
      ...get().settings,
      healthkit: { ...get().settings.healthkit, lastSyncAt: new Date().toISOString() },
    };
    saveSettings(settings);
    set({ settings });
  },

  // Points and cosmetics methods
  addPoints: (amount) => {
    const settings = {
      ...get().settings,
      totalPoints: get().settings.totalPoints + amount,
    };
    saveSettings(settings);
    set({ settings });
  },

  spendPoints: (amount) => {
    const available = get().getAvailablePoints();
    if (available < amount) return false;

    const settings = {
      ...get().settings,
      pointsSpent: get().settings.pointsSpent + amount,
    };
    saveSettings(settings);
    set({ settings });
    return true;
  },

  getAvailablePoints: () => {
    const { totalPoints, pointsSpent } = get().settings;
    return totalPoints - pointsSpent;
  },

  buyCosmetic: (cosmeticId, price) => {
    if (!get().spendPoints(price)) return false;

    const settings = {
      ...get().settings,
      cosmeticsOwned: [...get().settings.cosmeticsOwned, cosmeticId],
    };
    saveSettings(settings);
    set({ settings });
    return true;
  },

  equipCosmetic: (cosmeticId) => {
    const settings = { ...get().settings, equippedCosmetic: cosmeticId };
    saveSettings(settings);
    set({ settings });
  },

  ownsCosmetic: (cosmeticId) => {
    return get().settings.cosmeticsOwned.includes(cosmeticId);
  },

  // Walkthrough methods
  completeWalkthrough: () => {
    const settings = { ...get().settings, walkthroughCompleted: true };
    saveSettings(settings);
    set({ settings });
  },

  hasCompletedWalkthrough: () => {
    return get().settings.walkthroughCompleted === true;
  },

  // Code redemption methods
  redeemCode: (code) => {
    const normalizedCode = code.trim().toLowerCase();

    // Check if already redeemed
    if (get().hasRedeemedCode(normalizedCode)) {
      return { success: false, message: 'You have already redeemed this code!' };
    }

    // Define valid codes and their rewards
    const validCodes: Record<string, number> = {
      '1000points': 1000,
    };

    const points = validCodes[normalizedCode];
    if (points === undefined) {
      return { success: false, message: 'Invalid code. Please check and try again.' };
    }

    // Redeem the code
    const settings = {
      ...get().settings,
      totalPoints: get().settings.totalPoints + points,
      redeemedCodes: [...get().settings.redeemedCodes, normalizedCode],
    };
    saveSettings(settings);
    set({ settings });

    return { success: true, message: `You earned ${points} points!`, points };
  },

  hasRedeemedCode: (code) => {
    const normalizedCode = code.trim().toLowerCase();
    return get().settings.redeemedCodes.includes(normalizedCode);
  },
}));
