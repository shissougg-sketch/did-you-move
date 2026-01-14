import type { DailyEntry } from '../types/entry';
import type { UserSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const ENTRIES_KEY = 'did-you-move-entries';
const SETTINGS_KEY = 'did-you-move-settings';

// Current user ID for namespacing localStorage
let currentUserId: string | null = null;

// Get namespaced key for current user
const getKey = (baseKey: string): string => {
  return currentUserId ? `${baseKey}-${currentUserId}` : baseKey;
};

// Set current user ID (call on login)
export const setCurrentUser = (uid: string): void => {
  const previousUserId = currentUserId;
  currentUserId = uid;

  // Migrate old non-namespaced data to this user if it exists and user has no data yet
  if (!previousUserId) {
    migrateOldData(uid);
  }
};

// Clear current user ID (call on logout)
export const clearCurrentUser = (): void => {
  currentUserId = null;
};

// Get current user ID (for other stores to use)
export const getCurrentUserId = (): string | null => {
  return currentUserId;
};

// Migrate old non-namespaced data to user's namespaced keys
const migrateOldData = (uid: string): void => {
  try {
    // Check if user already has namespaced data
    const userEntriesKey = `${ENTRIES_KEY}-${uid}`;
    const existingUserEntries = localStorage.getItem(userEntriesKey);

    // If user has no data yet, check for old non-namespaced data
    if (!existingUserEntries) {
      const oldEntries = localStorage.getItem(ENTRIES_KEY);
      if (oldEntries) {
        // Migrate entries to user's namespace
        localStorage.setItem(userEntriesKey, oldEntries);
        // Remove old non-namespaced data
        localStorage.removeItem(ENTRIES_KEY);
      }
    }

    // Same for settings
    const userSettingsKey = `${SETTINGS_KEY}-${uid}`;
    const existingUserSettings = localStorage.getItem(userSettingsKey);

    if (!existingUserSettings) {
      const oldSettings = localStorage.getItem(SETTINGS_KEY);
      if (oldSettings) {
        localStorage.setItem(userSettingsKey, oldSettings);
        localStorage.removeItem(SETTINGS_KEY);
      }
    }

    // Migrate prompts
    const oldPrompts = localStorage.getItem('mobble-prompts');
    const userPromptsKey = `mobble-prompts-${uid}`;
    if (!localStorage.getItem(userPromptsKey) && oldPrompts) {
      localStorage.setItem(userPromptsKey, oldPrompts);
      localStorage.removeItem('mobble-prompts');
    }

    // Migrate story progress
    const oldStory = localStorage.getItem('mobble-story-progress');
    const userStoryKey = `mobble-story-progress-${uid}`;
    if (!localStorage.getItem(userStoryKey) && oldStory) {
      localStorage.setItem(userStoryKey, oldStory);
      localStorage.removeItem('mobble-story-progress');
    }
  } catch (error) {
    console.error('Failed to migrate old data:', error);
  }
};

export const loadEntries = (): DailyEntry[] => {
  try {
    const stored = localStorage.getItem(getKey(ENTRIES_KEY));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
};

export const saveEntries = (entries: DailyEntry[]): void => {
  try {
    localStorage.setItem(getKey(ENTRIES_KEY), JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries:', error);
  }
};

export const loadSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(getKey(SETTINGS_KEY));
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(getKey(SETTINGS_KEY), JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(getKey(ENTRIES_KEY));
  localStorage.removeItem(getKey(SETTINGS_KEY));
};
