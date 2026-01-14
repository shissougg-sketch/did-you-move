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
    const noteLength = note.trim().length;
    if (noteLength >= 101) return 3;
    if (noteLength >= 51) return 2;
    return 1;
  }

  // Same-day entries get base points + note bonus
  let points = 10; // Base reward

  // Note bonus calculation
  if (note && note.trim().length > 0) {
    const noteLength = note.trim().length;
    if (noteLength >= 101) {
      points += 3; // Detailed note
    } else if (noteLength >= 51) {
      points += 2; // Medium note
    } else {
      points += 1; // Short note
    }
  }

  return points;
};
