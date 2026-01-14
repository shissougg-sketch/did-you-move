/**
 * HealthKit integration types
 *
 * Note: HealthKit is only available on iOS devices.
 * This integration requires a native wrapper (Capacitor or similar)
 * to bridge between the web app and iOS HealthKit APIs.
 */

export interface HealthKitDayData {
  date: string; // YYYY-MM-DD format
  steps: number | null;
  activeCalories: number | null;
  workoutMinutes: number | null;
  workoutTypes: string[]; // e.g., ["Walking", "Running", "Cycling"]
  source: 'healthkit';
  syncedAt: string; // ISO timestamp
}

export interface HealthKitSummary {
  averageSteps: number;
  averageActiveCalories: number;
  totalWorkoutMinutes: number;
  mostCommonWorkout: string | null;
  daysWithData: number;
  period: 'weekly' | 'monthly';
}

export interface HealthKitPermissions {
  steps: boolean;
  activeCalories: boolean;
  workouts: boolean;
}

export interface HealthKitSyncResult {
  success: boolean;
  data?: HealthKitDayData[];
  error?: string;
  syncedAt?: string;
}

/**
 * Workout types that can be synced from HealthKit
 * These match Apple's HKWorkoutActivityType values
 */
export const SUPPORTED_WORKOUT_TYPES = [
  'Walking',
  'Running',
  'Cycling',
  'Swimming',
  'Yoga',
  'Strength Training',
  'HIIT',
  'Dance',
  'Hiking',
  'Elliptical',
  'Rowing',
  'Stair Climbing',
  'Other',
] as const;

export type SupportedWorkoutType = typeof SUPPORTED_WORKOUT_TYPES[number];
