export type BiologicalSex = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type HeightUnit = 'cm' | 'ft-in';
export type WeightUnit = 'kg' | 'lbs';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export const ACTIVITY_LEVELS = [
  { value: 'sedentary' as const, label: 'Sedentary', description: 'Desk job, little exercise', multiplier: 1.2 },
  { value: 'light' as const, label: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
  { value: 'moderate' as const, label: 'Moderate', description: 'Exercise 3-5 days/week', multiplier: 1.55 },
  { value: 'active' as const, label: 'Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
  { value: 'very-active' as const, label: 'Very Active', description: 'Physical job or 2x daily training', multiplier: 1.9 },
];

export interface UserProfile {
  age: number | null;
  heightCm: number | null; // Always stored in cm
  weightKg: number | null; // Always stored in kg (null if prefer not to say)
  weightPreferNotToSay: boolean; // True if user prefers not to share weight
  biologicalSex: BiologicalSex | null;
  activityLevel: ActivityLevel | null;
  // User's preferred display units
  preferredHeightUnit: HeightUnit;
  preferredWeightUnit: WeightUnit;
  // Calculated (shadow data - for AI use only, not displayed to users)
  bmr: number | null; // Calculated BMR in kcal/day
  tdee: number | null; // BMR × activity multiplier (for AI use only)
  // Metadata
  setupCompletedAt: string | null;
  updatedAt: string | null;
}

export interface BMRResult {
  bmr: number; // Base metabolic rate (kcal/day)
  tdee: {
    sedentary: number; // BMR × 1.2
    light: number; // BMR × 1.375
    moderate: number; // BMR × 1.55
    active: number; // BMR × 1.725
    veryActive: number; // BMR × 1.9
  };
}

export const DEFAULT_PROFILE: UserProfile = {
  age: null,
  heightCm: null,
  weightKg: null,
  weightPreferNotToSay: false,
  biologicalSex: null,
  activityLevel: null,
  preferredHeightUnit: 'ft-in',
  preferredWeightUnit: 'lbs',
  bmr: null,
  tdee: null,
  setupCompletedAt: null,
  updatedAt: null,
};
