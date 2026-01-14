import { Pencil, Plus } from 'lucide-react';
import { formatDate, canCreateBackdatedEntry } from '../utils/dateHelpers';
import type { DailyEntry, DidMove } from '../types/entry';

interface EntryDetailProps {
  date: string;
  entry?: DailyEntry;
  onEdit: () => void;
  onCreate: () => void;
}

const getColorClass = (didMove: DidMove) => {
  switch (didMove) {
    case 'yes':
      return 'bg-moved-yes border-moved-yes';
    case 'kind-of':
      return 'bg-moved-kind-of border-moved-kind-of';
    case 'no':
      return 'bg-moved-no border-moved-no';
  }
};

const getMoveLabel = (didMove: DidMove) => {
  switch (didMove) {
    case 'yes':
      return 'Moved';
    case 'kind-of':
      return 'Moved (kind of)';
    case 'no':
      return "Didn't move";
  }
};

export const EntryDetail = ({ date, entry, onEdit, onCreate }: EntryDetailProps) => {
  const canCreate = canCreateBackdatedEntry(date);

  if (!entry) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 text-center">
        <p className="text-slate-500 mb-4">No entry for {formatDate(date)}</p>
        {canCreate ? (
          <button
            onClick={onCreate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        ) : (
          <p className="text-sm text-slate-400">
            Cannot add entries for dates older than 7 days
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 p-6 ${getColorClass(entry.didMove)} transition-all`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {formatDate(entry.date)}
          </h3>
          <span className="text-sm font-medium text-slate-700">
            {getMoveLabel(entry.didMove)}
          </span>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-colors"
          title="Edit entry"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {entry.intensity && (
          <p className="text-sm text-slate-600">
            <span className="font-medium">Intensity:</span> {entry.intensity}
          </p>
        )}

        {entry.feeling && (
          <p className="text-sm text-slate-600">
            <span className="font-medium">Feeling:</span> {entry.feeling}
          </p>
        )}

        {entry.note && (
          <p className="mt-3 text-slate-700 bg-white/30 p-3 rounded-lg">
            {entry.note}
          </p>
        )}

        {entry.aiResponse && (
          <div className="mt-4 pt-4 border-t border-slate-300/50">
            <p className="text-sm text-slate-600 italic">{entry.aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
