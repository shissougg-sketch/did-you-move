import type { DidMove } from '../types/entry';
import { ENTRY_COLORS } from './constants';

/**
 * Get the Tailwind background class for a movement status
 */
export const getEntryColorClass = (didMove: DidMove): string => {
  return ENTRY_COLORS[didMove];
};

/**
 * Get the CSS color value for a movement status
 */
export const getEntryColor = (didMove: DidMove): string => {
  switch (didMove) {
    case 'yes':
      return '#4ADE80'; // Green
    case 'kind-of':
      return '#FFD24A'; // Yellow
    case 'no':
      return '#E5E7EB'; // Gray
  }
};
