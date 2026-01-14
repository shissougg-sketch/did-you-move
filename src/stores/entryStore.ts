import { create } from 'zustand';
import type { DailyEntry, DidMove, Intensity, Feeling } from '../types/entry';
import type { AIInterpretation } from '../types/aiInterpretation';
import { loadEntries, saveEntries } from '../utils/localStorage';
import { format } from 'date-fns';

interface EntryStore {
  entries: DailyEntry[];
  loadEntries: () => void;
  getTodayEntry: () => DailyEntry | undefined;
  getEntryByDate: (date: string) => DailyEntry | undefined;
  createEntry: (data: { didMove: DidMove; intensity: Intensity | null; feeling: Feeling | null; note: string | null }) => DailyEntry;
  createEntryForDate: (
    date: string,
    data: { didMove: DidMove; intensity: Intensity | null; feeling: Feeling | null; note: string | null }
  ) => DailyEntry;
  updateEntry: (id: string, updates: Partial<DailyEntry>) => void;
  deleteEntry: (id: string) => void;
  addAIResponse: (id: string, response: string) => void;
  addAIInterpretation: (id: string, interpretation: AIInterpretation) => void;
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],

  loadEntries: () => {
    const entries = loadEntries();
    set({ entries });
  },

  getTodayEntry: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().entries.find((entry) => entry.date === today);
  },

  getEntryByDate: (date: string) => {
    return get().entries.find((entry) => entry.date === date);
  },

  createEntry: (data) => {
    const now = new Date().toISOString();
    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      ...data,
      aiResponse: null,
      aiInterpretation: null,
      source: 'manual',
      createdAt: now,
      updatedAt: now,
    };

    const entries = [entry, ...get().entries];
    saveEntries(entries);
    set({ entries });
    return entry;
  },

  createEntryForDate: (date, data) => {
    const now = new Date().toISOString();
    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      date,
      ...data,
      aiResponse: null,
      aiInterpretation: null,
      source: 'manual',
      createdAt: now,
      updatedAt: now,
    };

    // Insert in correct position (sorted by date descending)
    const existingEntries = get().entries;
    const entries = [entry, ...existingEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    saveEntries(entries);
    set({ entries });
    return entry;
  },

  updateEntry: (id, updates) => {
    const entries = get().entries.map((entry) =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );
    saveEntries(entries);
    set({ entries });
  },

  deleteEntry: (id) => {
    const entries = get().entries.filter((entry) => entry.id !== id);
    saveEntries(entries);
    set({ entries });
  },

  addAIResponse: (id, response) => {
    get().updateEntry(id, { aiResponse: response });
  },

  addAIInterpretation: (id, interpretation) => {
    get().updateEntry(id, { aiInterpretation: interpretation });
  },
}));
