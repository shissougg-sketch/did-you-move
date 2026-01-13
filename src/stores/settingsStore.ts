import { create } from 'zustand';
import type { UserSettings, Tone } from '../types/settings';
import { loadSettings, saveSettings } from '../utils/localStorage';

interface SettingsStore {
  settings: UserSettings;
  loadSettings: () => void;
  updateTone: (tone: Tone) => void;
  toggleTrends: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  // Points and cosmetics methods
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  getAvailablePoints: () => number;
  buyCosmetic: (cosmeticId: string, price: number) => boolean;
  equipCosmetic: (cosmeticId: string | null) => void;
  ownsCosmetic: (cosmeticId: string) => boolean;
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
}));
