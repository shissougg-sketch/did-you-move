import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEntryStore } from '../stores/entryStore';
import { useSettingsStore } from '../stores/settingsStore';

export const Trends = () => {
  const { entries, loadEntries } = useEntryStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  if (!settings.showTrends) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200">
          <div className="page-container">
            <div className="flex items-center space-x-4 py-4">
              <Link
                to="/"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">Trends</h1>
            </div>
          </div>
        </nav>

        <main className="page-container py-12 text-center">
          <p className="text-slate-500 text-lg">Trends are hidden</p>
          <Link to="/settings" className="text-slate-700 hover:text-slate-900 underline mt-4 inline-block">
            Enable in settings
          </Link>
        </main>
      </div>
    );
  }

  const movedCount = entries.filter((e) => e.didMove === 'yes' || e.didMove === 'kind-of').length;
  const totalDays = entries.length;

  // Calculate if moving correlates with feeling better
  const movedAndBetter = entries.filter(
    (e) => (e.didMove === 'yes' || e.didMove === 'kind-of') && e.feeling === 'better'
  ).length;
  const movedTotal = entries.filter((e) => e.didMove === 'yes' || e.didMove === 'kind-of').length;

  const feelsBetterWhenMoving = movedTotal > 0 && movedAndBetter / movedTotal > 0.5;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="page-container">
          <div className="flex items-center space-x-4 py-4">
            <Link
              to="/"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Trends</h1>
          </div>
        </div>
      </nav>

      <main className="page-container py-8">
        {totalDays === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Not enough data yet</p>
            <p className="text-slate-400 mt-2">Check back after logging a few days</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Simple Insights</h2>

              <div className="space-y-4">
                <p className="text-slate-700 text-lg">
                  You moved <span className="font-semibold">{movedCount}</span> out of{' '}
                  <span className="font-semibold">{totalDays}</span> days
                </p>

                {feelsBetterWhenMoving && (
                  <p className="text-slate-700 text-lg">
                    You tend to feel better when you move
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
              <p className="text-slate-600">
                Remember: This isn't about perfection. It's about awareness.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
