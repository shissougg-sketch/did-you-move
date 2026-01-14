import type { AIInterpretation } from './aiInterpretation';

export type DidMove = 'yes' | 'kind-of' | 'no';
export type Intensity = 'easy' | 'moderate' | 'hard' | 'exhausting';
export type Feeling = 'better' | 'same' | 'worse';
export type EntrySource = 'manual' | 'healthkit';

export interface DailyEntry {
  id: string;
  date: string; // ISO date string
  didMove: DidMove;
  intensity: Intensity | null;
  feeling: Feeling | null;
  note: string | null;
  aiResponse: string | null;
  aiInterpretation: AIInterpretation | null; // AI analysis of the note
  source: EntrySource;
  createdAt: string;
  updatedAt: string;
}
