import { parseISO, subDays, isAfter, getDay } from 'date-fns';
import type { DailyEntry, Intensity } from '../types/entry';

export type TimeRange = 'weekly' | 'monthly';

export interface PatternInsights {
  timeRange: TimeRange;
  totalDays: number;
  entriesCount: number;
  movedDays: number;
  movementRate: number;
  bestDayOfWeek: string | null;
  dayOfWeekBreakdown: Record<string, number>;
  intensityBreakdown: Partial<Record<Intensity, number>>;
  dominantIntensity: Intensity | null;
  feelingWhenMoved: {
    better: number;
    same: number;
    worse: number;
  };
  feelingWhenNotMoved: {
    better: number;
    same: number;
    worse: number;
  };
  feelBetterRate: number;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const calculateInsights = (
  entries: DailyEntry[],
  timeRange: TimeRange
): PatternInsights => {
  const daysBack = timeRange === 'weekly' ? 7 : 30;
  const cutoffDate = subDays(new Date(), daysBack);

  const relevantEntries = entries.filter((e) =>
    isAfter(parseISO(e.date), cutoffDate)
  );

  // Movement stats
  const movedEntries = relevantEntries.filter(
    (e) => e.didMove === 'yes' || e.didMove === 'kind-of'
  );
  const notMovedEntries = relevantEntries.filter((e) => e.didMove === 'no');

  // Day of week breakdown
  const dayOfWeekBreakdown: Record<string, number> = {};
  DAYS_OF_WEEK.forEach((day) => (dayOfWeekBreakdown[day] = 0));

  movedEntries.forEach((e) => {
    const dayIndex = getDay(parseISO(e.date));
    const dayName = DAYS_OF_WEEK[dayIndex];
    dayOfWeekBreakdown[dayName]++;
  });

  // Find best day
  let bestDayOfWeek: string | null = null;
  let maxMoves = 0;
  Object.entries(dayOfWeekBreakdown).forEach(([day, count]) => {
    if (count > maxMoves) {
      maxMoves = count;
      bestDayOfWeek = day;
    }
  });

  // Intensity breakdown
  const intensityBreakdown: Partial<Record<Intensity, number>> = {};
  movedEntries.forEach((e) => {
    if (e.intensity) {
      intensityBreakdown[e.intensity] = (intensityBreakdown[e.intensity] || 0) + 1;
    }
  });

  // Find dominant intensity
  let dominantIntensity: Intensity | null = null;
  let maxIntensityCount = 0;
  (Object.entries(intensityBreakdown) as [Intensity, number][]).forEach(
    ([intensity, count]) => {
      if (count > maxIntensityCount) {
        maxIntensityCount = count;
        dominantIntensity = intensity;
      }
    }
  );

  // Feeling correlations
  const feelingWhenMoved = { better: 0, same: 0, worse: 0 };
  const feelingWhenNotMoved = { better: 0, same: 0, worse: 0 };

  movedEntries.forEach((e) => {
    if (e.feeling) {
      feelingWhenMoved[e.feeling]++;
    }
  });

  notMovedEntries.forEach((e) => {
    if (e.feeling) {
      feelingWhenNotMoved[e.feeling]++;
    }
  });

  // Calculate feel better rate when moving
  const totalMovedWithFeeling =
    feelingWhenMoved.better + feelingWhenMoved.same + feelingWhenMoved.worse;
  const feelBetterRate =
    totalMovedWithFeeling > 0
      ? Math.round((feelingWhenMoved.better / totalMovedWithFeeling) * 100)
      : 0;

  return {
    timeRange,
    totalDays: daysBack,
    entriesCount: relevantEntries.length,
    movedDays: movedEntries.length,
    movementRate:
      relevantEntries.length > 0
        ? Math.round((movedEntries.length / relevantEntries.length) * 100)
        : 0,
    bestDayOfWeek,
    dayOfWeekBreakdown,
    intensityBreakdown,
    dominantIntensity,
    feelingWhenMoved,
    feelingWhenNotMoved,
    feelBetterRate,
  };
};

export const generateInsightSummary = (insights: PatternInsights): string => {
  const { timeRange, movedDays, entriesCount, feelBetterRate, bestDayOfWeek, dominantIntensity } =
    insights;
  const periodLabel = timeRange === 'weekly' ? 'week' : 'month';

  if (entriesCount === 0) {
    return `No entries recorded this ${periodLabel}. Start logging to see your patterns!`;
  }

  const parts: string[] = [];

  // Movement summary
  if (movedDays === entriesCount && entriesCount > 0) {
    parts.push(`You moved every day you logged this ${periodLabel}.`);
  } else if (movedDays > 0) {
    parts.push(`You moved ${movedDays} out of ${entriesCount} days logged this ${periodLabel}.`);
  } else {
    parts.push(`You haven't logged any movement this ${periodLabel}.`);
  }

  // Best day insight
  if (bestDayOfWeek && movedDays > 1) {
    parts.push(`${bestDayOfWeek}s tend to be your most active day.`);
  }

  // Feeling correlation
  if (feelBetterRate >= 70 && movedDays > 2) {
    parts.push(`You reported feeling better ${feelBetterRate}% of the times you moved.`);
  } else if (feelBetterRate >= 50 && movedDays > 2) {
    parts.push(`About half the time you move, you feel better afterward.`);
  }

  // Intensity insight
  if (dominantIntensity && movedDays > 2) {
    parts.push(`Your typical workout intensity has been ${dominantIntensity}.`);
  }

  return parts.join(' ');
};
