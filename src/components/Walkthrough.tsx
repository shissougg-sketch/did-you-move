import { useState } from 'react';
import { Home, BarChart2, ShoppingBag, Map, Settings, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MobbleEmote } from './MobbleEmote';
import type { EmoteKey } from '../utils/emoteMapper';

interface WalkthroughStep {
  icon: LucideIcon;
  title: string;
  description: string;
  emote: EmoteKey;
  tabName: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    icon: Home,
    title: 'Your Daily Check-In',
    description: 'This is where you log your movement each day. Just 3 quick questions!',
    emote: 'happy',
    tabName: 'Home',
  },
  {
    icon: BarChart2,
    title: 'Track Your Patterns',
    description: 'See how your movement habits look over time. No judgments, just awareness.',
    emote: 'happysmile',
    tabName: 'Insights',
  },
  {
    icon: ShoppingBag,
    title: 'Earn & Customize',
    description: 'Earn points by checking in. Spend them on fun cosmetics for Mobble!',
    emote: 'winkwink',
    tabName: 'Store',
  },
  {
    icon: Map,
    title: "Mobble's Journey",
    description: 'Start a narrative adventure! Each check-in unlocks new story scenes.',
    emote: 'wegotthis',
    tabName: 'Story',
  },
  {
    icon: Settings,
    title: 'Make It Yours',
    description: 'Adjust your preferences, set reminders, and export your data anytime.',
    emote: 'coy',
    tabName: 'Settings',
  },
];

interface WalkthroughProps {
  onComplete: () => void;
}

export const Walkthrough = ({ onComplete }: WalkthroughProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const step = WALKTHROUGH_STEPS[currentStep];
  const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsExiting(false);
      }, 200);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-100 ${
          isExiting
            ? 'animate-out fade-out slide-out-to-left-4 duration-200'
            : 'animate-in fade-in slide-in-from-right-4 duration-300'
        }`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        {/* Tab Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg-light)' }}
          >
            <Icon className="w-8 h-8" style={{ color: 'var(--color-secondary)' }} />
          </div>
        </div>

        {/* Mobble Emote */}
        <div className="flex justify-center mb-4">
          <MobbleEmote emote={step.emote} animation="breathing" size="xl" alt="Mobble" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <p
            className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-secondary)' }}
          >
            {step.tabName}
          </p>
          <h2
            className="text-xl font-bold font-display mb-2"
            style={{ color: 'var(--color-text-heading)' }}
          >
            {step.title}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {WALKTHROUGH_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-6 bg-mobble-secondary'
                  : index < currentStep
                    ? 'bg-mobble-secondary/50'
                    : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {!isLastStep && (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-500 hover:bg-slate-100 transition-all"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className={`${isLastStep ? 'w-full' : 'flex-1'} py-3 px-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2`}
            style={{
              background: isLastStep
                ? 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)'
                : 'linear-gradient(135deg, var(--color-secondary) 0%, #2d7ab8 100%)',
              boxShadow: '0 4px 16px rgba(58, 141, 204, 0.3)',
            }}
          >
            {isLastStep ? (
              "Let's Go!"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
