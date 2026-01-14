import { Sparkles } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import { PageLayout } from '../components/PageLayout';
import { NavHeader } from '../components/NavHeader';
import { MobbleJourney } from '../components/MobbleJourney';
import { MobbleEmote } from '../components/MobbleEmote';
import { SidePathsSection, CompletedArcsSection, PremiumStoryPacksSection } from '../components/StoryScene';
import { Card, PillButton } from '../components/ui';

export const Story = () => {
  const { progress, hasStartedJourney, startJourney } = useStoryStore();

  // Check if user hasn't started yet
  if (!hasStartedJourney()) {
    return (
      <PageLayout>
        <NavHeader title="Mobble's Journey" titleImage="/headings/story.png" titleImageClassName="h-10" showBack />

        <main className="page-container pt-2 pb-8">
          <Card className="max-w-md mx-auto text-center !p-8">
            <MobbleEmote
              emote="happy"
              animation="breathing"
              size="2xl"
              alt="Mobble waiting"
            />

            <h2
              className="text-2xl font-bold mt-6 mb-4 font-display"
              style={{ color: 'var(--color-text-heading)' }}
            >
              Begin Your Journey
            </h2>

            <p className="text-slate-600 mb-2">
              Mobble is ready to explore with you.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Every time you log your day, you'll take a step forward together.
              No pressure, no penalties - just a gentle path ahead.
            </p>

            <PillButton
              variant="primary"
              onClick={startJourney}
              className="inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start the Journey</span>
            </PillButton>
          </Card>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <NavHeader title="Mobble's Journey" titleImage="/headings/story.png" titleImageClassName="h-10" showBack />

      <main className="page-container pt-2 pb-8 space-y-4">
        {/* Current Journey Progress */}
        <MobbleJourney />

        {/* Stats summary */}
        <Card>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p
                className="text-2xl font-bold font-display"
                style={{ color: 'var(--color-secondary)' }}
              >
                {progress.totalCheckIns}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total Check-ins</p>
            </div>
            <div>
              <p
                className="text-2xl font-bold font-display"
                style={{ color: 'var(--color-secondary)' }}
              >
                {progress.completedArcs.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Arcs Completed</p>
            </div>
            <div>
              <p
                className="text-2xl font-bold font-display"
                style={{ color: 'var(--color-secondary)' }}
              >
                {progress.unlockedScenes.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Scenes Unlocked</p>
            </div>
          </div>
        </Card>

        {/* Side Paths */}
        <SidePathsSection />

        {/* Premium Story Packs */}
        <PremiumStoryPacksSection />

        {/* Completed Arcs */}
        <CompletedArcsSection />

        {/* Encouragement footer */}
        <Card variant="ghost">
          <p className="text-slate-600 text-center">
            Every check-in is a step forward.
          </p>
          <p className="text-slate-500 text-sm mt-1 text-center">
            There's no wrong way to journey with Mobble.
          </p>
        </Card>
      </main>
    </PageLayout>
  );
};
