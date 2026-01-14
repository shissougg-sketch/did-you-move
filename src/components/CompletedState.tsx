import { useState } from 'react';
import { Edit3, Send } from 'lucide-react';
import type { DailyEntry } from '../types/entry';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import { getCompletionMessage } from '../utils/toneMessages';
import { getCompletionEmote, getCompletionAnimation } from '../utils/emoteMapper';
import { MobbleEmote } from './MobbleEmote';
import { NoteSuggestions } from './NoteSuggestions';
import { Card } from './ui';

interface CompletedStateProps {
  entry: DailyEntry;
  onEdit: () => void;
}

export const CompletedState = ({ entry, onEdit }: CompletedStateProps) => {
  const { settings } = useSettingsStore();
  const updateEntry = useEntryStore((state) => state.updateEntry);
  const addPoints = useSettingsStore((state) => state.addPoints);
  const [note, setNote] = useState('');
  const [noteAdded, setNoteAdded] = useState(false);

  const handleAddNote = () => {
    if (!note.trim()) return;

    updateEntry(entry.id, { note: note.trim() });
    // Award bonus point for adding a note
    addPoints(1);
    setNoteAdded(true);
  };

  const getMoveLabel = () => {
    switch (entry.didMove) {
      case 'yes':
        return 'Yes';
      case 'kind-of':
        return 'Kind of';
      case 'no':
        return 'No';
    }
  };

  const emoteAnimation = getCompletionAnimation(entry);

  // Get display note - either from entry or just added
  const displayNote = noteAdded ? note : entry.note;

  return (
    <div className="space-y-4">
      {/* Mobble celebration */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <MobbleEmote
            src={getCompletionEmote(entry)}
            animation={emoteAnimation as any}
            size="2xl"
            alt="Mobble celebrating"
          />
        </div>
        <h2
          className="text-2xl font-bold font-display"
          style={{ color: 'var(--color-secondary)' }}
        >
          {getCompletionMessage(settings.tone)}
        </h2>
      </div>

      {/* Combined Entry Summary Card */}
      <Card className="!p-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Moved</span>
            <p
              className="text-lg font-semibold mt-0.5"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {getMoveLabel()}
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Intensity</span>
            <p
              className="text-lg font-semibold mt-0.5 capitalize"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {entry.intensity || '—'}
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Felt after</span>
            <p
              className="text-lg font-semibold mt-0.5 capitalize"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {entry.feeling || '—'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Note Section */}
        {displayNote ? (
          <div className="mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Note</span>
            <p className="text-slate-700 mt-1">{displayNote}</p>
            {noteAdded && (
              <p className="text-xs text-teal-600 mt-1 font-medium">+1 point earned!</p>
            )}
          </div>
        ) : (
          /* Add Note Prompt - inline in the card */
          <div className="mb-4">
            <div className="flex items-start gap-3 mb-3">
              <MobbleEmote
                emote="coy"
                animation="breathing"
                size="xs"
                alt="Mobble asking"
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text-heading)' }}
                >
                  Add a note?
                </p>
                <p className="text-xs text-slate-500">
                  More details = better insights from Mobble
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you do today?"
                maxLength={200}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-mobble-secondary focus:ring-2 focus:ring-mobble-light focus:outline-none resize-none transition-all text-sm"
              />
              <NoteSuggestions currentNote={note} onSuggestionClick={setNote} />

              {note.trim() && (
                <button
                  onClick={handleAddNote}
                  className="w-full py-2.5 text-white rounded-xl font-medium text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add Note (+1 point)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Edit Button - inside the card */}
        <button
          onClick={onEdit}
          className="w-full py-2.5 rounded-xl font-medium text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit entry</span>
        </button>
      </Card>

      {/* AI Response */}
      {entry.aiResponse && (
        <Card className="!p-5">
          <p className="text-slate-700 leading-relaxed">{entry.aiResponse}</p>
        </Card>
      )}
    </div>
  );
};
