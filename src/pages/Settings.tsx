import { Download } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { Card, PillButton } from '../components/ui';
import { ReminderSettings } from '../components/ReminderSettings';
import { ProfileSettings } from '../components/ProfileSettings';
import { HealthKitSettings } from '../components/HealthKitSettings';
import { CodeRedemption } from '../components/CodeRedemption';
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
    link.download = `go-mobble-${new Date().toISOString().split('T')[0]}.json`;
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
    link.download = `go-mobble-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tones: { value: Tone; label: string }[] = [
    { value: 'gentle', label: 'Gentle' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'direct', label: 'Direct' },
  ];

  return (
    <PageLayout>
      <NavHeader title="Settings" titleImage="/headings/settings.png" showBack />

      <main className="page-container pt-2 pb-8 space-y-4">
        {/* Profile */}
        <ProfileSettings />

        {/* Preferences Card */}
        <Card>
          <h2 className="caption mb-4">Preferences</h2>

          {/* Tone Selection */}
          <div className="mb-5">
            <p className="text-sm text-slate-600 mb-3">Message Tone</p>
            <div className="flex gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => updateTone(tone.value)}
                  className={`
                    flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      settings.tone === tone.value
                        ? 'bg-mobble-secondary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-mobble-light'
                    }
                  `}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Insights Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-heading)' }}
              >
                Show Insights
              </p>
              <p className="text-xs text-slate-500">Movement patterns & trends</p>
            </div>
            <button
              onClick={toggleTrends}
              className={`
                relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200
                ${settings.showTrends ? 'bg-mobble-secondary' : 'bg-slate-200'}
              `}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200
                  ${settings.showTrends ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </Card>

        {/* Reminders */}
        <ReminderSettings />

        {/* Health Integration */}
        <HealthKitSettings />

        {/* Code Redemption */}
        <CodeRedemption />

        {/* Export Card */}
        <Card>
          <h2 className="caption mb-4">Your Data</h2>
          <div className="flex gap-3">
            <PillButton
              variant="primary"
              onClick={handleExportJSON}
              disabled={entries.length === 0}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </PillButton>
            <PillButton
              variant="primary"
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </PillButton>
          </div>
          {entries.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-3">
              No entries to export yet
            </p>
          )}
        </Card>

        {/* Philosophy Footer */}
        <Card variant="ghost">
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            <span
              className="font-medium"
              style={{ color: 'var(--color-text-heading)' }}
            >
              No calories. No macros. No streak shame.
            </span>
            <br />
            Just awareness, consistency, and honesty.
          </p>
        </Card>
      </main>
    </PageLayout>
  );
};
