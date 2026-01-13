import { create } from 'zustand';
import type { DailyEntry, DidMove, Intensity, Feeling } from '../types/entry';
import { loadEntries, saveEntries } from '../utils/localStorage';
import { format } from 'date-fns';

interface EntryStore {
  entries: DailyEntry[];
  loadEntries: () => void;
  getTodayEntry: () => DailyEntry | undefined;
  createEntry: (data: { didMove: DidMove; intensity: Intensity | null; feeling: Feeling | null; note: string | null }) => DailyEntry;
  updateEntry: (id: string, updates: Partial<DailyEntry>) => void;
  deleteEntry: (id: string) => void;
  addAIResponse: (id: string, response: string) => void;
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

  createEntry: (data) => {
    const now = new Date().toISOString();
    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      ...data,
      aiResponse: null,
      source: 'manual',
      createdAt: now,
      updatedAt: now,
    };

    const entries = [entry, ...get().entries];
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
}));
