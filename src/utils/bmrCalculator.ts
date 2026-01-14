import type { BMRResult, ActivityLevel } from '../types/profile';
import { ACTIVITY_LEVELS } from '../types/profile';

/**
 * Calculate BMR using Mifflin-St Jeor Equation (most accurate for modern populations)
 *
 * Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 *
 * Returns null if biologicalSex is 'prefer-not-to-say' (can't calculate accurately)
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  biologicalSex: 'male' | 'female' | 'other' | 'prefer-not-to-say'
): number | null => {
  if (biologicalSex === 'prefer-not-to-say' || biologicalSex === 'other') {
    // Return average of male/female calculation as estimate
    const maleBase = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    const femaleBase = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    return Math.round((maleBase + femaleBase) / 2);
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(biologicalSex === 'male' ? base + 5 : base - 161);
};

/**
 * Calculate Total Daily Energy Expenditure based on activity level
 */
export const calculateTDEE = (bmr: number): BMRResult['tdee'] => ({
  sedentary: Math.round(bmr * 1.2),
  light: Math.round(bmr * 1.375),
  moderate: Math.round(bmr * 1.55),
  active: Math.round(bmr * 1.725),
  veryActive: Math.round(bmr * 1.9),
});

/**
 * Get TDEE for a specific activity level
 * Returns null if bmr or activityLevel is null
 */
export const getTDEEForLevel = (bmr: number | null, activityLevel: ActivityLevel | null): number | null => {
  if (bmr === null || activityLevel === null) return null;

  const level = ACTIVITY_LEVELS.find(l => l.value === activityLevel);
  if (!level) return null;

  return Math.round(bmr * level.multiplier);
};

/**
 * Get full BMR result with TDEE calculations
 */
export const calculateBMRResult = (
  weightKg: number,
  heightCm: number,
  age: number,
  biologicalSex: 'male' | 'female' | 'other' | 'prefer-not-to-say'
): BMRResult | null => {
  const bmr = calculateBMR(weightKg, heightCm, age, biologicalSex);
  if (bmr === null) return null;

  return {
    bmr,
    tdee: calculateTDEE(bmr),
  };
};

/**
 * Estimate average weight based on height and biological sex.
 * Uses CDC/WHO population averages as a rough guideline.
 * Returns weight in kg.
 */
export const estimateAverageWeight = (
  heightCm: number,
  biologicalSex: 'male' | 'female' | 'other' | 'prefer-not-to-say'
): number => {
  // Use BMI of 22 (middle of healthy range 18.5-24.9) to estimate weight
  // Weight (kg) = BMI × height(m)²
  const heightM = heightCm / 100;
  const healthyBMI = 22;

  // Slight adjustment for biological sex (males tend to have slightly higher healthy BMI)
  let adjustedBMI = healthyBMI;
  if (biologicalSex === 'male') {
    adjustedBMI = 23;
  } else if (biologicalSex === 'female') {
    adjustedBMI = 21.5;
  }

  return Math.round(adjustedBMI * heightM * heightM);
};

// Unit conversion helpers

/**
 * Convert centimeters to feet and inches
 */
export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  return {
    feet: Math.floor(totalInches / 12),
    inches: Math.round(totalInches % 12),
  };
};

/**
 * Convert feet and inches to centimeters
 */
export const feetInchesToCm = (feet: number, inches: number): number => {
  return Math.round((feet * 12 + inches) * 2.54);
};

/**
 * Convert kilograms to pounds
 */
export const kgToLbs = (kg: number): number => Math.round(kg * 2.205);

/**
 * Convert pounds to kilograms
 */
export const lbsToKg = (lbs: number): number => Math.round(lbs / 2.205 * 10) / 10;

/**
 * Format height for display based on unit preference
 */
export const formatHeight = (heightCm: number | null, unit: 'cm' | 'ft-in'): string => {
  if (heightCm === null) return 'Not set';

  if (unit === 'cm') {
    return `${heightCm} cm`;
  }

  const { feet, inches } = cmToFeetInches(heightCm);
  return `${feet}'${inches}"`;
};

/**
 * Format weight for display based on unit preference
 */
export const formatWeight = (weightKg: number | null, unit: 'kg' | 'lbs'): string => {
  if (weightKg === null) return 'Not set';

  if (unit === 'kg') {
    return `${weightKg} kg`;
  }

  return `${kgToLbs(weightKg)} lbs`;
};
