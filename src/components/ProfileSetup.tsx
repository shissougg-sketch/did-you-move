import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { MobbleEmote } from './MobbleEmote';
import type { BiologicalSex, HeightUnit, WeightUnit, ActivityLevel } from '../types/profile';
import { ACTIVITY_LEVELS } from '../types/profile';
import { feetInchesToCm, lbsToKg } from '../utils/bmrCalculator';
import type { EmoteKey } from '../utils/emoteMapper';

// Emotes for each step
const STEP_EMOTES: Record<number, EmoteKey> = {
  1: 'happy',
  2: 'coy',
  3: 'wegotthis',
};

// Titles for each step
const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Let's personalize your experience",
    subtitle: 'This helps us provide better insights. All info stays on your device.',
  },
  2: {
    title: 'Height & Weight',
    subtitle: 'Used to calculate your base metabolic rate (BMR).',
  },
  3: {
    title: 'Almost there!',
    subtitle: 'A few more details to personalize your insights.',
  },
};

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const { completeProfileSetup } = useSettingsStore();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [age, setAge] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft-in');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | ''>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');

  // Height state
  const [heightCm, setHeightCm] = useState<string>('');
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');

  // Weight state
  const [weightKg, setWeightKg] = useState<string>('');
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [weightPreferNotToSay, setWeightPreferNotToSay] = useState(false);

  const handleSkip = () => {
    completeProfileSetup({});
    navigate('/');
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    let finalHeightCm: number | null = null;
    if (heightUnit === 'cm' && heightCm) {
      finalHeightCm = parseInt(heightCm, 10);
    } else if (heightUnit === 'ft-in' && heightFeet) {
      finalHeightCm = feetInchesToCm(
        parseInt(heightFeet, 10) || 0,
        parseInt(heightInches, 10) || 0
      );
    }

    let finalWeightKg: number | null = null;
    if (!weightPreferNotToSay) {
      if (weightUnit === 'kg' && weightKg) {
        finalWeightKg = parseFloat(weightKg);
      } else if (weightUnit === 'lbs' && weightLbs) {
        finalWeightKg = lbsToKg(parseFloat(weightLbs));
      }
    }

    completeProfileSetup({
      age: age ? parseInt(age, 10) : null,
      heightCm: finalHeightCm,
      weightKg: finalWeightKg,
      weightPreferNotToSay,
      biologicalSex: biologicalSex || null,
      activityLevel: activityLevel || null,
      preferredHeightUnit: heightUnit,
      preferredWeightUnit: weightUnit,
    });

    navigate('/');
  };

  const currentEmote = STEP_EMOTES[step];
  const currentTitles = STEP_TITLES[step];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EAF6FD 100%)' }}
    >
      {/* Header */}
      <header className="pt-6 pb-2 px-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <img src="/Mobble.png" alt="Go Mobble" className="h-10 w-auto object-contain" />
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white/50"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Skip
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-5 py-3">
        <div className="flex gap-2 max-w-md mx-auto">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i < step ? 'bg-mobble-secondary' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-5 py-4 overflow-auto">
        <div className="max-w-md mx-auto">
          {/* Mobble Emote */}
          <div className="flex justify-center mb-4">
            <MobbleEmote emote={currentEmote} animation="breathing" size="xl" alt="Mobble" />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1
              className="text-2xl font-bold font-display mb-2"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {currentTitles.title}
            </h1>
            <p className="text-slate-500 text-sm">{currentTitles.subtitle}</p>
          </div>

          {/* Step 1: Age */}
          {step === 1 && (
            <div
              className="bg-white rounded-2xl p-5 border border-slate-100"
              style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
            >
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--color-text-heading)' }}
              >
                How old are you?
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="13"
                max="120"
                className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={
                  {
                    '--tw-ring-color': 'var(--color-secondary)',
                  } as React.CSSProperties
                }
              />
              <p className="text-xs text-slate-400 mt-2">Optional - you can skip this</p>
            </div>
          )}

          {/* Step 2: Height & Weight */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Height Card */}
              <div
                className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Height
                  </label>
                  <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setHeightUnit('cm')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        heightUnit === 'cm'
                          ? 'bg-white text-mobble-secondary shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      onClick={() => setHeightUnit('ft-in')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        heightUnit === 'ft-in'
                          ? 'bg-white text-mobble-secondary shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      ft/in
                    </button>
                  </div>
                </div>
                {heightUnit === 'cm' ? (
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="Height in cm"
                    min="100"
                    max="250"
                    className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={
                      {
                        '--tw-ring-color': 'var(--color-secondary)',
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="0"
                        min="3"
                        max="8"
                        className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-center"
                        style={
                          {
                            '--tw-ring-color': 'var(--color-secondary)',
                          } as React.CSSProperties
                        }
                      />
                      <p className="text-xs text-slate-400 mt-1 text-center">feet</p>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="11"
                        className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-center"
                        style={
                          {
                            '--tw-ring-color': 'var(--color-secondary)',
                          } as React.CSSProperties
                        }
                      />
                      <p className="text-xs text-slate-400 mt-1 text-center">inches</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight Card */}
              <div
                className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-heading)' }}
                  >
                    Weight
                  </label>
                  {!weightPreferNotToSay && (
                    <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg">
                      <button
                        onClick={() => setWeightUnit('kg')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          weightUnit === 'kg'
                            ? 'bg-white text-mobble-secondary shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        kg
                      </button>
                      <button
                        onClick={() => setWeightUnit('lbs')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          weightUnit === 'lbs'
                            ? 'bg-white text-mobble-secondary shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        lbs
                      </button>
                    </div>
                  )}
                </div>
                {!weightPreferNotToSay ? (
                  <input
                    type="number"
                    value={weightUnit === 'kg' ? weightKg : weightLbs}
                    onChange={(e) =>
                      weightUnit === 'kg' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
                    }
                    placeholder={`Weight in ${weightUnit}`}
                    min="30"
                    max={weightUnit === 'kg' ? '300' : '660'}
                    className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={
                      {
                        '--tw-ring-color': 'var(--color-secondary)',
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  <p className="text-sm text-slate-500 py-3 text-center">
                    We'll use an average estimate based on your height
                  </p>
                )}
                <button
                  onClick={() => {
                    setWeightPreferNotToSay(!weightPreferNotToSay);
                    if (!weightPreferNotToSay) {
                      setWeightKg('');
                      setWeightLbs('');
                    }
                  }}
                  className={`w-full mt-3 py-2.5 px-4 text-sm font-medium rounded-xl border transition-all ${
                    weightPreferNotToSay
                      ? 'border-mobble-secondary bg-mobble-light text-mobble-secondary'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Prefer not to say
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Bio Sex & Activity */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Biological Sex Card */}
              <div
                className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'var(--color-text-heading)' }}
                >
                  Biological sex
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBiologicalSex(option.value)}
                      className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${
                        biologicalSex === option.value
                          ? 'border-mobble-secondary bg-mobble-light text-mobble-secondary'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level Card */}
              <div
                className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'var(--color-text-heading)' }}
                >
                  Activity level
                </label>
                <div className="space-y-2">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setActivityLevel(level.value)}
                      className={`w-full py-3 px-4 text-left rounded-xl border transition-all ${
                        activityLevel === level.value
                          ? 'border-mobble-secondary bg-mobble-light'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`font-medium text-sm ${
                          activityLevel === level.value ? 'text-mobble-secondary' : 'text-slate-700'
                        }`}
                      >
                        {level.label}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">{level.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info note */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--color-bg-light)' }}
              >
                <p className="text-sm text-slate-500 text-center">
                  All info is optional. You can always update this in Settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <div className="px-5 py-4 pb-8">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium transition-all hover:bg-white/50"
              style={{ color: 'var(--color-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, var(--color-secondary) 0%, #2d7ab8 100%)',
              boxShadow: '0 4px 16px rgba(58, 141, 204, 0.3)',
            }}
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
