// Animation durations (in ms)
export const ANIMATION_DURATION = {
  QUESTION_TRANSITION: 300,
  FADE_IN: 100,
  API_SIMULATED_DELAY: 500,
} as const;

// Note length thresholds for points calculation
export const NOTE_THRESHOLDS = {
  DETAILED: 101, // 101+ chars = detailed note
  MEDIUM: 51, // 51-100 chars = medium note
  // 1-50 chars = brief note
} as const;

// Calendar settings
export const CALENDAR = {
  DAYS_TO_SHOW: 7,
} as const;

// Points awarded for different note lengths
export const NOTE_POINTS = {
  DETAILED: 3,
  MEDIUM: 2,
  BRIEF: 1,
} as const;

// Entry color mappings
export const ENTRY_COLORS = {
  yes: 'bg-moved-yes',
  'kind-of': 'bg-moved-kind-of',
  no: 'bg-moved-no',
} as const;

// Redemption codes (should eventually come from backend)
export const REDEMPTION_CODES: Record<string, number> = {
  '1000points': 1000,
} as const;
