import { NOTE_THRESHOLDS, NOTE_POINTS } from './constants';

const BASE_ENTRY_POINTS = 10;

/**
 * Calculate note bonus points based on note length
 */
const calculateNoteBonus = (noteLength: number): number => {
  if (noteLength >= NOTE_THRESHOLDS.DETAILED) return NOTE_POINTS.DETAILED;
  if (noteLength >= NOTE_THRESHOLDS.MEDIUM) return NOTE_POINTS.MEDIUM;
  return NOTE_POINTS.BRIEF;
};

export const calculatePointsForEntry = (
  note: string | null,
  isBackdated: boolean = false
): number => {
  // For backdated entries, only award points if note is provided
  if (isBackdated) {
    if (!note || note.trim().length === 0) {
      return 0;
    }
    // Award note bonus only for backdated entries
    return calculateNoteBonus(note.trim().length);
  }

  // Same-day entries get base points + note bonus
  let points = BASE_ENTRY_POINTS;

  // Note bonus calculation
  if (note && note.trim().length > 0) {
    points += calculateNoteBonus(note.trim().length);
  }

  return points;
};
