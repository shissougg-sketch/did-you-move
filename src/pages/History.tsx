import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEntryStore } from '../stores/entryStore';
import { formatDate } from '../utils/dateHelpers';
import type { DidMove } from '../types/entry';

export const History = () => {
  const { entries, loadEntries } = useEntryStore();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

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
        return 'Didn\'t move';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="page-container">
          <div className="flex items-center space-x-4 py-4">
            <Link
              to="/"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">History</h1>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="page-container py-8">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No entries yet</p>
            <Link to="/" className="text-slate-700 hover:text-slate-900 underline mt-4 inline-block">
              Create your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-6 rounded-xl border-2 ${getColorClass(entry.didMove)} transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {formatDate(entry.date)}
                  </h3>
                  <span className="text-sm font-medium text-slate-700">
                    {getMoveLabel(entry.didMove)}
                  </span>
                </div>

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
                  <p className="mt-3 text-slate-700">{entry.note}</p>
                )}

                {entry.aiResponse && (
                  <div className="mt-4 pt-4 border-t border-slate-300">
                    <p className="text-sm text-slate-600 italic">{entry.aiResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
