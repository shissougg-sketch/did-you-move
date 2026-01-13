import { create } from 'zustand';
import type { UserSettings, Tone } from '../types/settings';
import { loadSettings, saveSettings } from '../utils/localStorage';

interface SettingsStore {
  settings: UserSettings;
  loadSettings: () => void;
  updateTone: (tone: Tone) => void;
  toggleTrends: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
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
}));
