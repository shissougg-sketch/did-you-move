import { format, subDays } from 'date-fns';
import type { DailyEntry, DidMove, Intensity, Feeling } from '../types/entry';

const SAMPLE_NOTES = [
  "Went for a morning jog around the park, felt great afterward.",
  "Quick 20 min HIIT session before work.",
  "Walked to the grocery store and back, counts as something!",
  "Yoga session, really helped with back tension.",
  "Didn't feel like it but pushed through a short workout.",
  "Rest day, body needed it.",
  "Long hike with friends, beautiful weather.",
  "Swimming laps at the pool for 30 mins.",
  "Just some light stretching today.",
  "Bike ride to the coffee shop.",
  "Gym session - focused on legs today.",
  "Dancing around the house while cleaning.",
  "Took the stairs instead of elevator all day.",
  "Evening walk to clear my head.",
  "Tried a new workout video, it was brutal!",
  "Played basketball with coworkers at lunch.",
  "Gardening for a couple hours, surprisingly tiring.",
  "Rock climbing at the indoor gym.",
  "Just walked the dog, nothing major.",
  "Full body workout at home.",
  null,
  null,
  null,
  null,
  null,
];

const DID_MOVE_OPTIONS: DidMove[] = ['yes', 'yes', 'yes', 'kind-of', 'kind-of', 'no'];
const INTENSITY_OPTIONS: Intensity[] = ['easy', 'easy', 'moderate', 'moderate', 'hard', 'exhausting'];
const FEELING_OPTIONS: Feeling[] = ['better', 'better', 'better', 'same', 'same', 'worse'];

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateSeedEntries = (daysBack: number = 30): DailyEntry[] => {
  const entries: DailyEntry[] = [];

  for (let i = 1; i <= daysBack; i++) {
    // Skip some days randomly (about 20% of days)
    if (Math.random() < 0.2) continue;

    const date = subDays(new Date(), i);
    const dateString = format(date, 'yyyy-MM-dd');
    const didMove = randomFrom(DID_MOVE_OPTIONS);
    const createdAt = new Date(date.getTime() + 18 * 60 * 60 * 1000).toISOString(); // 6pm that day

    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      date: dateString,
      didMove,
      intensity: randomFrom(INTENSITY_OPTIONS),
      feeling: randomFrom(FEELING_OPTIONS),
      note: randomFrom(SAMPLE_NOTES),
      aiResponse: didMove !== 'no'
        ? "Keep up the good work! Every movement counts toward building a healthier you."
        : "Rest days are important too. Listen to your body.",
      aiInterpretation: null,
      source: 'manual',
      createdAt,
      updatedAt: createdAt,
    };

    entries.push(entry);
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const seedLocalStorage = () => {
  const entries = generateSeedEntries(30);
  localStorage.setItem('did-you-move-entries', JSON.stringify(entries));
  console.log(`Seeded ${entries.length} entries`);
  return entries;
};
