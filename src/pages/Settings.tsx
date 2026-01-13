import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import type { Tone } from '../types/settings';

export const Settings = () => {
  const { settings, updateTone, toggleTrends } = useSettingsStore();
  const { entries } = useEntryStore();

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `did-you-move-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Did Move', 'Intensity', 'Feeling', 'Note', 'AI Response'];
    const rows = entries.map((e) => [
      e.date,
      e.didMove,
      e.intensity || '',
      e.feeling || '',
      e.note || '',
      e.aiResponse || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `did-you-move-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tones: { value: Tone; label: string; description: string }[] = [
    {
      value: 'gentle',
      label: 'Gentle',
      description: 'Encouraging and warm. "Anything counts."',
    },
    {
      value: 'neutral',
      label: 'Neutral',
      description: 'Clear and straightforward. "Did you move today?"',
    },
    {
      value: 'direct',
      label: 'Direct',
      description: 'Brief and to the point. "Did you do anything physical?"',
    },
  ];

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
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          </div>
        </div>
      </nav>

      <main className="page-container py-8 space-y-6">
        {/* Tone Selection */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tone</h2>
          <div className="space-y-3">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => updateTone(tone.value)}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all
                  ${
                    settings.tone === tone.value
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="font-medium text-slate-800">{tone.label}</div>
                <div className="text-sm text-slate-600 mt-1">{tone.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trends Toggle */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Show Trends</h2>
              <p className="text-sm text-slate-600 mt-1">
                Display insights about your movement patterns
              </p>
            </div>
            <button
              onClick={toggleTrends}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.showTrends ? 'bg-slate-800' : 'bg-slate-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.showTrends ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Export Data</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportJSON}
              disabled={entries.length === 0}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as CSV</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Philosophy</h2>
          <div className="text-slate-700 space-y-2">
            <p>This app is for people who work out inconsistently and get overwhelmed by data.</p>
            <p className="font-medium">No calories. No macros. No streak shame. No social feed.</p>
            <p>Just awareness, consistency, and honesty.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
