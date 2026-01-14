import { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import { useSettingsStore } from '../stores/settingsStore';
import { STORY_ARCS, SIDE_PATHS, type StoryScene as StorySceneType, type SidePath } from '../types/story';
import { PREMIUM_STORY_PACKS } from '../types/storyPacks';
import { MobbleEmote } from './MobbleEmote';
import { ProBadge, UpgradeModal } from './UpgradeModal';
import { Lock, Unlock, Coins, Gift, ChevronRight, Check, X, BookOpen } from 'lucide-react';

interface SidePathCardProps {
  sidePath: SidePath;
  isUnlocked: boolean;
  isCompleted: boolean;
  currentProgress: number;
  availablePoints: number;
  onUnlock: () => void;
  onView: () => void;
}

const SidePathCard = ({
  sidePath,
  isUnlocked,
  isCompleted,
  currentProgress,
  availablePoints,
  onUnlock,
  onView,
}: SidePathCardProps) => {
  const canAfford = availablePoints >= sidePath.pointsCost;

  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all"
      style={{
        boxShadow: isCompleted
          ? '0 10px 40px rgba(78, 205, 196, 0.15)'
          : '0 10px 40px rgba(0,0,0,0.05)',
        borderColor: isCompleted ? 'rgba(78, 205, 196, 0.3)' : undefined,
        opacity: !isUnlocked && !canAfford ? 0.7 : 1,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-slate-800">{sidePath.name}</h4>
            {isCompleted && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100">
                <Check className="w-3 h-3 text-teal-600" />
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">{sidePath.description}</p>

          {/* Progress or cost */}
          <div className="mt-3">
            {isUnlocked ? (
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(currentProgress / sidePath.scenes.length) * 100}%`,
                      background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {currentProgress}/{sidePath.scenes.length}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-sm">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className={canAfford ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                  {sidePath.pointsCost} points
                </span>
                {!canAfford && (
                  <span className="text-xs text-slate-400">
                    (need {sidePath.pointsCost - availablePoints} more)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reward preview */}
          {sidePath.reward && (
            <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
              <Gift className="w-3 h-3" />
              <span>Reward: {sidePath.reward.name}</span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="ml-4">
          {isUnlocked ? (
            <button
              onClick={onView}
              className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onUnlock}
              disabled={!canAfford}
              className={`p-2 rounded-xl transition-all ${
                canAfford
                  ? 'text-amber-600 hover:bg-amber-50'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              {canAfford ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface SceneViewerProps {
  scenes: StorySceneType[];
  unlockedScenes: string[];
  title: string;
  onClose: () => void;
}

const SceneViewer = ({ scenes, unlockedScenes, title, onClose }: SceneViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentScene = scenes[currentIndex];
  const isUnlocked = unlockedScenes.includes(currentScene?.id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden border border-white/20"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene content */}
        <div className="p-6">
          {isUnlocked ? (
            <div className="text-center">
              <MobbleEmote
                storyEmote={currentScene.mobbleEmote}
                animation="wobble"
                size="xl"
                alt={currentScene.title}
              />
              <h4 className="text-lg font-semibold text-slate-800 mt-4">{currentScene.title}</h4>
              <p className="text-slate-600 mt-2">{currentScene.description}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)' }}
              >
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mt-4">Keep checking in to unlock this scene</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 rounded-xl transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              {currentIndex + 1} / {scenes.length}
            </span>
            <button
              onClick={() => setCurrentIndex(Math.min(scenes.length - 1, currentIndex + 1))}
              disabled={currentIndex === scenes.length - 1}
              className="px-4 py-2 text-sm text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 rounded-xl transition-all"
            >
              Next
            </button>
          </div>

          {/* Scene dots */}
          <div className="flex items-center justify-center space-x-1.5 mt-3">
            {scenes.map((s, i) => {
              const unlocked = unlockedScenes.includes(s.id);
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: isCurrent ? '16px' : '8px',
                    background: isCurrent
                      ? 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)'
                      : unlocked
                      ? 'rgba(78, 205, 196, 0.4)'
                      : '#CBD5E1',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SidePathsSection = () => {
  const { progress, unlockSidePath, getSidePathProgress } = useStoryStore();
  const { getAvailablePoints, spendPoints } = useSettingsStore();
  const availablePoints = getAvailablePoints();

  const [viewingSidePath, setViewingSidePath] = useState<SidePath | null>(null);

  const handleUnlock = (sidePath: SidePath) => {
    if (spendPoints(sidePath.pointsCost)) {
      unlockSidePath(sidePath.id);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Side Paths
          </h3>
          <div
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full"
            style={{ boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)' }}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-amber-600 text-sm">{availablePoints}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Unlock bonus journeys with your points. No pressure - they're here whenever you're ready.
        </p>

        <div className="space-y-3">
          {SIDE_PATHS.map((sidePath) => {
            const isUnlocked = progress.unlockedSidePaths.includes(sidePath.id);
            const isCompleted = progress.completedSidePaths.includes(sidePath.id);
            const currentProgress = getSidePathProgress(sidePath.id);

            return (
              <SidePathCard
                key={sidePath.id}
                sidePath={sidePath}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                currentProgress={currentProgress}
                availablePoints={availablePoints}
                onUnlock={() => handleUnlock(sidePath)}
                onView={() => setViewingSidePath(sidePath)}
              />
            );
          })}
        </div>
      </div>

      {/* Scene Viewer Modal */}
      {viewingSidePath && (
        <SceneViewer
          scenes={viewingSidePath.scenes}
          unlockedScenes={progress.unlockedScenes}
          title={viewingSidePath.name}
          onClose={() => setViewingSidePath(null)}
        />
      )}
    </>
  );
};

export const CompletedArcsSection = () => {
  const { progress } = useStoryStore();
  const [viewingArc, setViewingArc] = useState<typeof STORY_ARCS[0] | null>(null);

  const completedArcs = STORY_ARCS.filter((arc) =>
    progress.completedArcs.includes(arc.id)
  );

  if (completedArcs.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Completed Journeys
        </h3>

        <div className="space-y-3">
          {completedArcs.map((arc) => (
            <button
              key={arc.id}
              onClick={() => setViewingArc(arc)}
              className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-left transition-all hover:scale-[1.01]"
              style={{
                boxShadow: '0 10px 40px rgba(78, 205, 196, 0.15)',
                borderColor: 'rgba(78, 205, 196, 0.3)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4
                      className="font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {arc.name}
                    </h4>
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100">
                      <Check className="w-3 h-3 text-teal-600" />
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{arc.scenes.length} scenes unlocked</p>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scene Viewer Modal */}
      {viewingArc && (
        <SceneViewer
          scenes={viewingArc.scenes}
          unlockedScenes={progress.unlockedScenes}
          title={viewingArc.name}
          onClose={() => setViewingArc(null)}
        />
      )}
    </>
  );
};

export const PremiumStoryPacksSection = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const handlePackClick = (packName: string) => {
    setSelectedPack(packName);
    setShowUpgradeModal(true);
  };

  // Only show if there are premium packs
  if (PREMIUM_STORY_PACKS.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Premium Story Packs
          </h3>
          <ProBadge />
        </div>

        <p className="text-sm text-slate-500">
          Additional journeys coming soon. Subscribe to unlock them all.
        </p>

        <div className="space-y-3">
          {PREMIUM_STORY_PACKS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => handlePackClick(pack.name)}
              className="w-full rounded-2xl p-4 border text-left transition-all hover:scale-[1.01] opacity-75"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.2)',
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.08)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <h4 className="font-semibold text-slate-800">{pack.name}</h4>
                    {pack.isComingSoon && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{pack.description}</p>

                  {/* Pack info */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <BookOpen className="w-3 h-3" />
                      <span>{pack.totalScenes} scenes</span>
                    </div>
                    {pack.rewards.cosmetics.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Gift className="w-3 h-3" />
                        <span>{pack.rewards.cosmetics.length} cosmetic rewards</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="ml-4 flex flex-col items-end">
                  <span className="font-semibold text-purple-600">
                    ${pack.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setSelectedPack(null);
        }}
        context="story"
        itemName={selectedPack || undefined}
      />
    </>
  );
};
