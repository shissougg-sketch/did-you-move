export type PromptId =
  | 'complete-profile'
  | 'add-notes'
  | 'discover-story'
  | 'discover-insights'
  | 'set-activity-level';

export type PromptPriority = 1 | 2 | 3;

export interface PromptDefinition {
  id: PromptId;
  priority: PromptPriority; // 1 = highest (missing info), 2 = encourage notes, 3 = feature discovery
  title: string;
  message: string;
  actionLabel: string;
  actionPath?: string; // Route to navigate to
  condition: 'missing-profile' | 'no-note-today' | 'not-started-journey' | 'no-insights-visit' | 'missing-activity-level';
}

export interface PromptState {
  // Track which prompts were dismissed today
  dismissedToday: {
    date: string; // YYYY-MM-DD
    promptIds: PromptId[];
  };
  // Track if a prompt was shown this session
  shownThisSession: boolean;
  // Track feature discovery (permanent)
  discoveredFeatures: PromptId[];
}

export const PROMPT_DEFINITIONS: PromptDefinition[] = [
  {
    id: 'complete-profile',
    priority: 1,
    title: 'Complete Your Profile',
    message: 'Add your details to get personalized insights about your activity.',
    actionLabel: 'Set Up Profile',
    actionPath: '/setup',
    condition: 'missing-profile',
  },
  {
    id: 'set-activity-level',
    priority: 1,
    title: 'Set Your Activity Level',
    message: 'Help us understand your lifestyle for better insights.',
    actionLabel: 'Update Profile',
    actionPath: '/settings',
    condition: 'missing-activity-level',
  },
  {
    id: 'add-notes',
    priority: 2,
    title: 'Add a Note Next Time',
    message: 'Notes help track what activities you did and how you felt.',
    actionLabel: 'Got It',
    condition: 'no-note-today',
  },
  {
    id: 'discover-story',
    priority: 3,
    title: "Discover Mobble's Journey",
    message: 'Follow along as Mobble grows with each check-in you make.',
    actionLabel: 'Explore',
    actionPath: '/story',
    condition: 'not-started-journey',
  },
  {
    id: 'discover-insights',
    priority: 3,
    title: 'Check Your Insights',
    message: 'See patterns in your movement and how you feel over time.',
    actionLabel: 'View Insights',
    actionPath: '/insights',
    condition: 'no-insights-visit',
  },
];
