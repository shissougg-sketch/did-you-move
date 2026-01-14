import type { PatternInsights } from './insightsCalculator';

export type InsightType = 'movement' | 'bestDay' | 'intensity' | 'feelBetter';

export type EmoteKey = 'happy' | 'happysmile' | 'coy' | 'phew' | 'tired' | 'wegotthis' | 'winkwink';

export interface InsightDetail {
  title: string;
  emote: EmoteKey;
  paragraphs: string[];
}

/**
 * Generate a detailed summary for a specific insight type.
 * Uses pre-set responses based on the data patterns.
 */
export const getInsightDetail = (
  type: InsightType,
  insights: PatternInsights
): InsightDetail => {
  switch (type) {
    case 'movement':
      return getMovementDetail(insights);
    case 'bestDay':
      return getBestDayDetail(insights);
    case 'intensity':
      return getIntensityDetail(insights);
    case 'feelBetter':
      return getFeelBetterDetail(insights);
  }
};

const getMovementDetail = (insights: PatternInsights): InsightDetail => {
  const { movedDays, entriesCount, movementRate, timeRange } = insights;
  const periodLabel = timeRange === 'weekly' ? 'week' : 'month';

  if (entriesCount === 0) {
    return {
      title: 'Movement',
      emote: 'coy',
      paragraphs: [
        "You haven't logged any entries yet this " + periodLabel + ".",
        "Start tracking your movement to see patterns emerge. Even a quick check-in helps build awareness!",
      ],
    };
  }

  if (movementRate >= 70) {
    return {
      title: 'Movement',
      emote: 'wegotthis',
      paragraphs: [
        `You're building a strong habit! Moving ${movedDays} out of ${entriesCount} days shows real commitment to staying active.`,
        "Consistency like this is what creates lasting change. Your body and mind are thanking you for showing up regularly.",
        "Keep this momentum going - you've proven you can make movement a priority!",
      ],
    };
  }

  if (movementRate >= 40) {
    return {
      title: 'Movement',
      emote: 'happysmile',
      paragraphs: [
        `You're making progress! Moving ${movedDays} out of ${entriesCount} days means you're building awareness of your activity.`,
        "Every movement counts, whether it's a full workout or just a walk. The goal isn't perfection - it's consistency over time.",
        "Try to find small opportunities to move more. Even adding one more active day can make a difference!",
      ],
    };
  }

  return {
    title: 'Movement',
    emote: 'coy',
    paragraphs: [
      `You've moved ${movedDays} out of ${entriesCount} days this ${periodLabel}. Starting is often the hardest part!`,
      "Remember, this isn't about judging yourself. It's about awareness. Now that you're tracking, you can start making small changes.",
      "Try setting a simple goal: just 10 minutes of movement tomorrow. Small wins build momentum!",
    ],
  };
};

const getBestDayDetail = (insights: PatternInsights): InsightDetail => {
  const { bestDayOfWeek, dayOfWeekBreakdown, movedDays } = insights;

  if (!bestDayOfWeek || movedDays === 0) {
    return {
      title: 'Best Day',
      emote: 'coy',
      paragraphs: [
        "Not enough data yet to identify your most active day.",
        "Keep logging your movement and patterns will start to emerge!",
      ],
    };
  }

  const count = dayOfWeekBreakdown[bestDayOfWeek] || 0;

  return {
    title: 'Best Day',
    emote: 'winkwink',
    paragraphs: [
      `Your data shows ${bestDayOfWeek}s are when you're most active, with ${count} movement${count !== 1 ? 's' : ''} logged.`,
      "This could be due to your schedule, energy levels, or just having more flexibility on this day. Understanding your patterns helps you plan better.",
      `Consider using ${bestDayOfWeek}s as your anchor day - the one you never skip. Build your week around this strength!`,
    ],
  };
};

const getIntensityDetail = (insights: PatternInsights): InsightDetail => {
  const { dominantIntensity, intensityBreakdown, movedDays } = insights;

  if (!dominantIntensity || movedDays === 0) {
    return {
      title: 'Intensity',
      emote: 'coy',
      paragraphs: [
        "Not enough movement data yet to analyze your typical intensity.",
        "Log a few more active days and we'll show you your patterns!",
      ],
    };
  }

  const intensityLabels: Record<string, string> = {
    easy: 'easy',
    moderate: 'moderate',
    hard: 'hard',
    exhausting: 'exhausting',
  };

  const breakdown = Object.entries(intensityBreakdown)
    .map(([level, count]) => `${intensityLabels[level]}: ${count}`)
    .join(', ');

  switch (dominantIntensity) {
    case 'easy':
      return {
        title: 'Intensity',
        emote: 'happy',
        paragraphs: [
          "Your typical effort level is easy - and that's totally valid!",
          "Gentle movement like walking, stretching, or light activity still counts. It's sustainable and kind to your body.",
          `Your breakdown: ${breakdown}. Easy sessions are the foundation of a long-term movement practice.`,
        ],
      };
    case 'moderate':
      return {
        title: 'Intensity',
        emote: 'happysmile',
        paragraphs: [
          "You're finding a good balance with mostly moderate-intensity movement.",
          "This level gives you fitness benefits while being sustainable. You're challenging yourself without burning out.",
          `Your breakdown: ${breakdown}. Keep mixing it up based on how you feel each day!`,
        ],
      };
    case 'hard':
    case 'exhausting':
      return {
        title: 'Intensity',
        emote: 'phew',
        paragraphs: [
          `You're pushing yourself with mostly ${dominantIntensity} workouts. That takes real dedication!`,
          "High-intensity work builds strength and endurance, but make sure you're also allowing for recovery. Rest days are when your body adapts.",
          `Your breakdown: ${breakdown}. Consider adding an easy day here and there to prevent burnout.`,
        ],
      };
    default:
      return {
        title: 'Intensity',
        emote: 'happy',
        paragraphs: [
          `Your typical workout intensity has been ${dominantIntensity}.`,
          `Your breakdown: ${breakdown}.`,
        ],
      };
  }
};

const getFeelBetterDetail = (insights: PatternInsights): InsightDetail => {
  const { feelBetterRate, feelingWhenMoved, movedDays } = insights;

  if (movedDays === 0) {
    return {
      title: 'Feel Better',
      emote: 'coy',
      paragraphs: [
        "No movement logged yet, so we can't show the mood connection.",
        "When you start tracking, you'll see how movement affects how you feel!",
      ],
    };
  }

  const { better, same, worse } = feelingWhenMoved;
  const total = better + same + worse;

  if (total === 0) {
    return {
      title: 'Feel Better',
      emote: 'coy',
      paragraphs: [
        "You've logged movement but haven't recorded how you felt afterward.",
        "Try noting your mood after moving - it helps reveal the mind-body connection!",
      ],
    };
  }

  if (feelBetterRate >= 70) {
    return {
      title: 'Feel Better',
      emote: 'wegotthis',
      paragraphs: [
        `The connection is clear - ${feelBetterRate}% of the time you move, you feel better afterward!`,
        `Out of ${total} times you moved, you felt better ${better} times, the same ${same} times, and worse ${worse} times.`,
        "Your body is giving you a clear signal: movement improves your mood. Remember this on days when motivation is low!",
      ],
    };
  }

  if (feelBetterRate >= 50) {
    return {
      title: 'Feel Better',
      emote: 'happysmile',
      paragraphs: [
        `Movement often improves your mood - ${feelBetterRate}% of the time you feel better after.`,
        `Out of ${total} times you moved, you felt better ${better} times, the same ${same} times, and worse ${worse} times.`,
        "The mind-body connection is there. Pay attention to what types of movement make you feel best!",
      ],
    };
  }

  return {
    title: 'Feel Better',
    emote: 'coy',
    paragraphs: [
      `You've reported feeling better ${feelBetterRate}% of the time after moving.`,
      `Out of ${total} times you moved, you felt better ${better} times, the same ${same} times, and worse ${worse} times.`,
      "The mind-body connection can take time to develop. Experiment with different types, times, and intensities of movement to find what works for you.",
    ],
  };
};
