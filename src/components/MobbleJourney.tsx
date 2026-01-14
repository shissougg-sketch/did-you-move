import { useStoryStore } from '../stores/storyStore';
import { getMobbleMessage, type MobbleEmote as MobbleEmoteType } from '../types/story';
import { MapPin, Lock, Sparkles } from 'lucide-react';
import { MobbleEmote } from './MobbleEmote';

interface MobbleJourneyProps {
  compact?: boolean;
}

export const MobbleJourney = ({ compact = false }: MobbleJourneyProps) => {
  const { progress, getCurrentScene, getArcProgress } = useStoryStore();
  const currentScene = getCurrentScene();
  const arcProgress = getArcProgress();

  if (!currentScene) {
    return null;
  }

  const { arc, scene } = currentScene;

  // Get Mobble's message based on current emote
  const mobbleMessage = getMobbleMessage(scene.mobbleEmote);

  if (compact) {
    // Compact view for home page card
    return (
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <MobbleEmote
              storyEmote={scene.mobbleEmote}
              size="sm"
              autoAnimate
            />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{arc.name}</p>
              <p className="text-xs text-slate-500">{scene.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Progress</p>
            <p
              className="font-semibold"
              style={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {arcProgress.percentage}%
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${arcProgress.percentage}%`,
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
            }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2 italic">{mobbleMessage}</p>
      </div>
    );
  }

  // Full view for Story page
  return (
    <div className="space-y-6">
      {/* Current Scene Header */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-start space-x-4">
          <MobbleEmote
            storyEmote={scene.mobbleEmote}
            size="lg"
            autoAnimate
          />
          <div className="flex-1">
            <p
              className="text-sm uppercase tracking-wide font-medium"
              style={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {arc.name}
            </p>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{scene.title}</h2>
            <p className="text-slate-600 mt-2">{scene.description}</p>
          </div>
        </div>
      </div>

      {/* Journey Map */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      >
        <h3 className="font-semibold text-slate-800 mb-4">Your Journey</h3>

        <div className="relative">
          {/* Path line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{
              background: 'linear-gradient(to bottom, #4ECDC4 0%, #E2E8F0 100%)',
            }}
          />

          {/* Scene markers */}
          <div className="space-y-4">
            {arc.scenes.map((s, index) => {
              const isUnlocked = progress.unlockedScenes.includes(s.id) || index <= progress.currentSceneIndex;
              const isCurrent = index === progress.currentSceneIndex;

              return (
                <div
                  key={s.id}
                  className={`relative flex items-center space-x-4 pl-1 ${
                    isCurrent ? 'scale-105 origin-left' : ''
                  } transition-transform duration-300`}
                >
                  {/* Marker */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                      isCurrent
                        ? 'ring-4 ring-teal-200'
                        : isUnlocked
                        ? ''
                        : 'bg-slate-300'
                    }`}
                    style={
                      isCurrent || isUnlocked
                        ? {
                            background: isCurrent
                              ? 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)'
                              : '#4ECDC4',
                          }
                        : undefined
                    }
                  >
                    {isCurrent ? (
                      <MapPin className="w-4 h-4 text-white" />
                    ) : isUnlocked ? (
                      <Sparkles className="w-3 h-3 text-white" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-500" />
                    )}
                  </div>

                  {/* Scene info */}
                  <div className={`flex-1 ${!isUnlocked ? 'opacity-50' : ''}`}>
                    <p
                      className={`font-medium ${
                        isCurrent ? 'text-teal-600' : 'text-slate-700'
                      }`}
                    >
                      {isUnlocked ? s.title : '???'}
                    </p>
                    {isUnlocked && (
                      <p className="text-sm text-slate-500">{s.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {arcProgress.current} of {arcProgress.total} check-ins
            </span>
            <span
              className="font-semibold"
              style={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {arcProgress.percentage}% complete
            </span>
          </div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${arcProgress.percentage}%`,
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobble's Message */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      >
        <p className="text-slate-600 text-center italic">"{mobbleMessage}"</p>
      </div>
    </div>
  );
};

// Legacy MobbleAvatar export for backwards compatibility
// Now wraps the new MobbleEmote component
interface MobbleAvatarProps {
  emote: string;
  size?: 'sm' | 'md' | 'lg';
}

const MobbleAvatar = ({ emote, size = 'md' }: MobbleAvatarProps) => {
  const sizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  return (
    <MobbleEmote
      storyEmote={emote as MobbleEmoteType}
      size={sizeMap[size]}
      autoAnimate
    />
  );
};

export { MobbleAvatar };
