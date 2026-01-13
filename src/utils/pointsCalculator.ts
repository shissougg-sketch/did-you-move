export const calculatePointsForEntry = (note: string | null): number => {
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
