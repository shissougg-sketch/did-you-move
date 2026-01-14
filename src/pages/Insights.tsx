import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, TrendingUp, Smile, Heart, X } from 'lucide-react';
import { useEntryStore } from '../stores/entryStore';
import { useSettingsStore } from '../stores/settingsStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { InsightCard } from '../components/InsightCard';
import { TimeRangeToggle } from '../components/TimeRangeToggle';
import { MobbleEmote } from '../components/MobbleEmote';
import { Card, PillButton } from '../components/ui';
import {
  calculateInsights,
  generateInsightSummary,
  type TimeRange,
} from '../utils/insightsCalculator';
import { formatSteps, formatCalories } from '../utils/healthkitClient';
import { getInsightDetail, type InsightType } from '../utils/insightSummaries';

export const Insights = () => {
  const { entries, loadEntries } = useEntryStore();
  const { settings } = useSettingsStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(null);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const insights = useMemo(
    () => calculateInsights(entries, timeRange),
    [entries, timeRange]
  );

  const summary = useMemo(() => generateInsightSummary(insights), [insights]);

  // Insights hidden state
  if (!settings.showTrends) {
    return (
      <PageLayout>
        <NavHeader title="Insights" titleImage="/headings/insights.png" showBack />

        <main className="page-container pt-2 pb-8 text-center space-y-6">
          <Card className="!p-8">
            <MobbleEmote emote="coy" animation="wobble" size="xl" alt="Insights hidden" />
            <p className="text-slate-500 text-lg mt-4">Insights are hidden</p>
            <Link to="/settings" className="inline-block mt-4">
              <PillButton variant="primary">
                Enable in Settings
              </PillButton>
            </Link>
          </Card>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <NavHeader title="Insights" titleImage="/headings/insights.png" showBack />

      <main className="page-container pt-2 pb-8 space-y-4">
        <TimeRangeToggle selected={timeRange} onChange={setTimeRange} />

        {insights.entriesCount === 0 ? (
          <Card className="!p-8 text-center">
            <MobbleEmote emote="happy" animation="breathing" size="xl" alt="Waiting for data" />
            <p className="text-slate-500 text-lg mt-4">Not enough data yet</p>
            <p className="text-slate-400 mt-2">Check back after logging a few days</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Stats Grid */}
            <p className="text-sm text-slate-500 text-center">
              Tap any card for a detailed summary
            </p>
            <div className="grid grid-cols-2 gap-3">
              <InsightCard
                icon={Activity}
                title="Movement"
                value={`${insights.movedDays}/${insights.entriesCount}`}
                subtitle="days you moved"
                variant={insights.movementRate >= 70 ? 'highlight' : 'default'}
                onClick={() => setSelectedInsight('movement')}
              />
              <InsightCard
                icon={Calendar}
                title="Best Day"
                value={insights.bestDayOfWeek || 'N/A'}
                subtitle="most active"
                onClick={() => setSelectedInsight('bestDay')}
              />
              <InsightCard
                icon={TrendingUp}
                title="Intensity"
                value={insights.dominantIntensity || 'N/A'}
                subtitle="typical effort"
                onClick={() => setSelectedInsight('intensity')}
              />
              <InsightCard
                icon={Smile}
                title="Feel Better"
                value={`${insights.feelBetterRate}%`}
                subtitle="when you move"
                variant={insights.feelBetterRate >= 60 ? 'highlight' : 'default'}
                onClick={() => setSelectedInsight('feelBetter')}
              />
            </div>

            {/* Summary Card */}
            <Card>
              <h3 className="caption mb-3">
                Your {timeRange === 'weekly' ? 'Week' : 'Month'} Summary
              </h3>
              <p className="text-slate-700 leading-relaxed">{summary}</p>
            </Card>

            {/* Health App Data */}
            {settings.healthkit.connected && (
              <Card>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-red-50">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="caption">
                    From Health App
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="bg-slate-50/80 rounded-2xl p-4"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)' }}
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Steps</p>
                    <p
                      className="text-xl font-bold mt-1"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      {formatSteps(null)}
                    </p>
                  </div>
                  <div
                    className="bg-slate-50/80 rounded-2xl p-4"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)' }}
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Calories</p>
                    <p
                      className="text-xl font-bold mt-1"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      {formatCalories(null)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">
                  Health data will appear here when synced.
                </p>
              </Card>
            )}

            {/* Philosophy Footer */}
            <Card variant="ghost">
              <p className="text-sm text-slate-500 text-center">
                Remember: This isn't about perfection. It's about awareness.
              </p>
            </Card>
          </div>
        )}
      </main>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            {(() => {
              const detail = getInsightDetail(selectedInsight, insights);
              return (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedInsight(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center -mt-2">
                    <MobbleEmote
                      emote={detail.emote}
                      animation="breathing"
                      size="xl"
                      alt={detail.title}
                    />

                    <h3
                      className="text-xl font-semibold mt-4 font-display"
                      style={{ color: 'var(--color-text-heading)' }}
                    >
                      {detail.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-left">
                      {detail.paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-slate-600 text-sm leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedInsight(null)}
                      className="mt-6 w-full py-3 px-4 rounded-xl font-medium text-white transition-all hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                        boxShadow: '0 4px 16px rgba(78, 205, 196, 0.3)',
                      }}
                    >
                      Got it!
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </PageLayout>
  );
};
