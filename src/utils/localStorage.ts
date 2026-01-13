import type { DailyEntry } from '../types/entry';
import type { UserSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const ENTRIES_KEY = 'did-you-move-entries';
const SETTINGS_KEY = 'did-you-move-settings';

export const loadEntries = (): DailyEntry[] => {
  try {
    const stored = localStorage.getItem(ENTRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
};

export const saveEntries = (entries: DailyEntry[]): void => {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries:', error);
  }
};

export const loadSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(ENTRIES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};
