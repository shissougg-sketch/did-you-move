import { CheckCircle2, Edit3, Coins } from 'lucide-react';
import type { DailyEntry } from '../types/entry';
import { useSettingsStore } from '../stores/settingsStore';
import { getCompletionMessage } from '../utils/toneMessages';
import { calculatePointsForEntry } from '../utils/pointsCalculator';

interface CompletedStateProps {
  entry: DailyEntry;
  onEdit: () => void;
}

export const CompletedState = ({ entry, onEdit }: CompletedStateProps) => {
  const { settings } = useSettingsStore();

  const getMoveLabel = () => {
    switch (entry.didMove) {
      case 'yes':
        return 'Moved';
      case 'kind-of':
        return 'Moved (kind of)';
      case 'no':
        return "Didn't move";
    }
  };

  const pointsEarned = calculatePointsForEntry(entry.note);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-slate-700 mx-auto" />
        <h2 className="text-3xl font-semibold text-slate-800">
          {getCompletionMessage(settings.tone)}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-slate-200 space-y-4">
        <div>
          <span className="text-sm text-slate-500 uppercase tracking-wide">Status</span>
          <p className="text-lg font-medium text-slate-800 mt-1">{getMoveLabel()}</p>
        </div>

        {entry.intensity && (
          <div>
            <span className="text-sm text-slate-500 uppercase tracking-wide">Intensity</span>
            <p className="text-lg font-medium text-slate-800 mt-1 capitalize">
              {entry.intensity}
            </p>
          </div>
        )}

        {entry.feeling && (
          <div>
            <span className="text-sm text-slate-500 uppercase tracking-wide">
              How you feel
            </span>
            <p className="text-lg font-medium text-slate-800 mt-1 capitalize">
              {entry.feeling}
            </p>
          </div>
        )}

        {entry.note && (
          <div>
            <span className="text-sm text-slate-500 uppercase tracking-wide">Note</span>
            <p className="text-lg text-slate-700 mt-1">{entry.note}</p>
          </div>
        )}
      </div>

      {/* Points Earned */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Coins className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Points Earned Today</p>
            <p className="text-xs text-yellow-600">Keep logging to earn more!</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-yellow-700">+{pointsEarned}</div>
      </div>

      {entry.aiResponse && (
        <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-6 border border-slate-200">
          <p className="text-lg text-slate-700 leading-relaxed">{entry.aiResponse}</p>
        </div>
      )}

      <button
        onClick={onEdit}
        className="w-full py-3 px-6 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2 text-slate-700 font-medium"
      >
        <Edit3 className="w-4 h-4" />
        <span>Edit entry</span>
      </button>
    </div>
  );
};
