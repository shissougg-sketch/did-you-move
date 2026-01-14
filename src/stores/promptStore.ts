import { create } from 'zustand';
import type { PromptId, PromptState, PromptDefinition } from '../types/prompts';
import { PROMPT_DEFINITIONS } from '../types/prompts';
import { getCurrentUserId } from '../utils/localStorage';

const BASE_STORAGE_KEY = 'mobble-prompts';

const getStorageKey = (): string => {
  const userId = getCurrentUserId();
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : BASE_STORAGE_KEY;
};

const getToday = () => new Date().toISOString().split('T')[0];

const getDefaultState = (): PromptState => ({
  dismissedToday: { date: getToday(), promptIds: [] },
  shownThisSession: false,
  discoveredFeatures: [],
});

const loadPromptState = (): PromptState => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      const state = JSON.parse(stored) as PromptState;
      // Reset dismissedToday if it's a new day
      if (state.dismissedToday.date !== getToday()) {
        return {
          ...state,
          dismissedToday: { date: getToday(), promptIds: [] },
          shownThisSession: false,
        };
      }
      // Always reset shownThisSession on load (new session)
      return { ...state, shownThisSession: false };
    }
  } catch (e) {
    console.error('Failed to load prompt state:', e);
  }
  return getDefaultState();
};

const savePromptState = (state: PromptState) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save prompt state:', e);
  }
};

interface PromptConditionContext {
  isProfileComplete: boolean;
  hasActivityLevel: boolean;
  todayEntryHasNote: boolean;
  hasStartedJourney: boolean;
  hasVisitedInsights: boolean;
}

interface PromptStore {
  state: PromptState;
  // Reload state from localStorage (for user switch)
  reloadState: () => void;
  // Check if we can show a prompt this session
  canShowPrompt: () => boolean;
  // Get the next prompt to show based on conditions and priority
  getNextPrompt: (context: PromptConditionContext) => PromptDefinition | null;
  // Dismiss a prompt (won't show again today)
  dismissPrompt: (promptId: PromptId) => void;
  // Mark that a prompt was shown this session
  markPromptShown: () => void;
  // Mark a feature as discovered (won't show that discovery prompt again)
  markFeatureDiscovered: (promptId: PromptId) => void;
  // Track insights page visit
  markInsightsVisited: () => void;
  hasVisitedInsights: () => boolean;
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  state: loadPromptState(),

  reloadState: () => {
    const state = loadPromptState();
    set({ state });
  },

  canShowPrompt: () => {
    return !get().state.shownThisSession;
  },

  getNextPrompt: (context) => {
    const { state } = get();

    // Already shown a prompt this session
    if (state.shownThisSession) return null;

    // Filter prompts by conditions
    const eligiblePrompts = PROMPT_DEFINITIONS.filter((prompt) => {
      // Already dismissed today
      if (state.dismissedToday.promptIds.includes(prompt.id)) return false;

      // Already discovered (for feature discovery prompts)
      if (state.discoveredFeatures.includes(prompt.id)) return false;

      // Check specific conditions
      switch (prompt.condition) {
        case 'missing-profile':
          return !context.isProfileComplete;
        case 'missing-activity-level':
          return context.isProfileComplete && !context.hasActivityLevel;
        case 'no-note-today':
          return !context.todayEntryHasNote;
        case 'not-started-journey':
          return !context.hasStartedJourney;
        case 'no-insights-visit':
          return !context.hasVisitedInsights;
        default:
          return false;
      }
    });

    if (eligiblePrompts.length === 0) return null;

    // Sort by priority (1 = highest)
    eligiblePrompts.sort((a, b) => a.priority - b.priority);

    return eligiblePrompts[0];
  },

  dismissPrompt: (promptId) => {
    const newState = {
      ...get().state,
      dismissedToday: {
        date: getToday(),
        promptIds: [...get().state.dismissedToday.promptIds, promptId],
      },
      shownThisSession: true,
    };
    savePromptState(newState);
    set({ state: newState });
  },

  markPromptShown: () => {
    const newState = {
      ...get().state,
      shownThisSession: true,
    };
    savePromptState(newState);
    set({ state: newState });
  },

  markFeatureDiscovered: (promptId) => {
    if (get().state.discoveredFeatures.includes(promptId)) return;

    const newState = {
      ...get().state,
      discoveredFeatures: [...get().state.discoveredFeatures, promptId],
      shownThisSession: true,
    };
    savePromptState(newState);
    set({ state: newState });
  },

  markInsightsVisited: () => {
    // This is tracked in discoveredFeatures
    const { state } = get();
    if (!state.discoveredFeatures.includes('discover-insights')) {
      const newState: PromptState = {
        ...state,
        discoveredFeatures: [...state.discoveredFeatures, 'discover-insights'] as PromptId[],
      };
      savePromptState(newState);
      set({ state: newState });
    }
  },

  hasVisitedInsights: () => {
    return get().state.discoveredFeatures.includes('discover-insights');
  },
}));
