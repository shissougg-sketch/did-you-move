import { useState } from 'react';
import { X } from 'lucide-react';
import { QuestionButton } from './QuestionButton';
import { NoteSuggestions } from './NoteSuggestions';
import { formatDate, isBackdatedDate } from '../utils/dateHelpers';
import { calculatePointsForEntry } from '../utils/pointsCalculator';
import { useEntryStore } from '../stores/entryStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { DidMove, Intensity, Feeling, DailyEntry } from '../types/entry';

interface BackdatedEntryFormProps {
  date: string;
  existingEntry?: DailyEntry;
  onClose: () => void;
  onSave: () => void;
}

export const BackdatedEntryForm = ({
  date,
  existingEntry,
  onClose,
  onSave,
}: BackdatedEntryFormProps) => {
  const { createEntryForDate, updateEntry, deleteEntry } = useEntryStore();
  const addPoints = useSettingsStore((state) => state.addPoints);

  const [didMove, setDidMove] = useState<DidMove | null>(existingEntry?.didMove ?? null);
  const [intensity, setIntensity] = useState<Intensity | null>(existingEntry?.intensity ?? null);
  const [feeling, setFeeling] = useState<Feeling | null>(existingEntry?.feeling ?? null);
  const [note, setNote] = useState(existingEntry?.note ?? '');

  const isBackdated = isBackdatedDate(date);
  const potentialPoints = calculatePointsForEntry(note.trim() || null, isBackdated);
  const isFormComplete = didMove && intensity && feeling;
  const isEditing = !!existingEntry;

  const handleSave = () => {
    if (!didMove || !intensity || !feeling) return;

    if (isEditing && existingEntry) {
      updateEntry(existingEntry.id, {
        didMove,
        intensity,
        feeling,
        note: note.trim() || null,
      });
    } else {
      createEntryForDate(date, {
        didMove,
        intensity,
        feeling,
        note: note.trim() || null,
      });
      addPoints(potentialPoints);
    }

    onSave();
  };

  const handleDelete = () => {
    if (existingEntry) {
      deleteEntry(existingEntry.id);
      onSave();
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          {isEditing ? 'Edit' : 'Add'} Entry for {formatDate(date)}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">Did you move?</h4>
          <div className="grid grid-cols-3 gap-2">
            <QuestionButton
              label="Yes"
              selected={didMove === 'yes'}
              onClick={() => setDidMove('yes')}
              variant="yes"
            />
            <QuestionButton
              label="Kind of"
              selected={didMove === 'kind-of'}
              onClick={() => setDidMove('kind-of')}
              variant="kind-of"
            />
            <QuestionButton
              label="No"
              selected={didMove === 'no'}
              onClick={() => setDidMove('no')}
              variant="no"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">How hard was it?</h4>
          <div className="grid grid-cols-2 gap-2">
            <QuestionButton
              label="Easy"
              selected={intensity === 'easy'}
              onClick={() => setIntensity('easy')}
            />
            <QuestionButton
              label="Moderate"
              selected={intensity === 'moderate'}
              onClick={() => setIntensity('moderate')}
            />
            <QuestionButton
              label="Hard"
              selected={intensity === 'hard'}
              onClick={() => setIntensity('hard')}
            />
            <QuestionButton
              label="Exhausting"
              selected={intensity === 'exhausting'}
              onClick={() => setIntensity('exhausting')}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">How did you feel?</h4>
          <div className="grid grid-cols-3 gap-2">
            <QuestionButton
              label="Better"
              selected={feeling === 'better'}
              onClick={() => setFeeling('better')}
            />
            <QuestionButton
              label="Same"
              selected={feeling === 'same'}
              onClick={() => setFeeling('same')}
            />
            <QuestionButton
              label="Worse"
              selected={feeling === 'worse'}
              onClick={() => setFeeling('worse')}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">
            Note {isBackdated && !isEditing && <span className="text-slate-400">(add a note to earn points)</span>}
          </h4>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="1-2 sentences about this day..."
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-300 focus:ring-offset-2 focus:outline-none resize-none"
          />
          <NoteSuggestions currentNote={note} onSuggestionClick={setNote} />
          <p className="text-xs text-slate-400 mt-1">{note.length}/200 characters</p>
        </div>

        {isBackdated && !isEditing && (
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              Points for this entry:{' '}
              <span className="font-semibold text-slate-800">
                {potentialPoints > 0 ? `+${potentialPoints}` : '0'}
              </span>
              {potentialPoints === 0 && (
                <span className="text-slate-400 ml-1">(add a note to earn points)</span>
              )}
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          {isEditing && (
            <button
              onClick={handleDelete}
              className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormComplete}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              isFormComplete
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};
