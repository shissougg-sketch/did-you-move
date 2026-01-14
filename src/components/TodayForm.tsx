import { useState, useEffect, useRef } from 'react';
import { QuestionButton } from './QuestionButton';
import { AIResponse } from './AIResponse';
import { NoteSuggestions } from './NoteSuggestions';
import { MobbleEmote } from './MobbleEmote';
import { PromptCard } from './PromptCard';
import type { DidMove, Intensity, Feeling } from '../types/entry';
import type { PromptDefinition } from '../types/prompts';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import { useStoryStore } from '../stores/storyStore';
import { usePromptStore } from '../stores/promptStore';
import { getToneMessage } from '../utils/toneMessages';
import { generateAIResponse } from '../utils/aiClient';
import { calculatePointsForEntry } from '../utils/pointsCalculator';

type QuestionStep = 'q1' | 'q2' | 'q3' | 'complete';

export const TodayForm = () => {
  const { settings } = useSettingsStore();
  const addPoints = useSettingsStore((state) => state.addPoints);
  const isProfileComplete = useSettingsStore((state) => state.isProfileComplete);
  const createEntry = useEntryStore((state) => state.createEntry);
  const addAIResponse = useEntryStore((state) => state.addAIResponse);
  const recordCheckIn = useStoryStore((state) => state.recordCheckIn);
  const hasStartedJourney = useStoryStore((state) => state.hasStartedJourney);
  const startJourney = useStoryStore((state) => state.startJourney);
  const { getNextPrompt, dismissPrompt, markFeatureDiscovered, hasVisitedInsights } = usePromptStore();

  const [didMove, setDidMove] = useState<DidMove | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [note, setNote] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [storyUpdate, setStoryUpdate] = useState<{ newScene: boolean; arcCompleted: boolean; newArc: boolean } | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuestionStep>('q1');
  const [isExiting, setIsExiting] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<PromptDefinition | null>(null);
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to transition between questions
  const transitionToNextQuestion = (nextQuestion: QuestionStep) => {
    setIsExiting(true);
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveQuestion(nextQuestion);
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  // Question answer handlers with transitions
  const handleDidMoveAnswer = (answer: DidMove) => {
    setDidMove(answer);
    transitionToNextQuestion('q2');
  };

  const handleIntensityAnswer = (answer: Intensity) => {
    setIntensity(answer);
    transitionToNextQuestion('q3');
  };

  const handleFeelingAnswer = (answer: Feeling) => {
    setFeeling(answer);
    transitionToNextQuestion('complete');
  };

  // Check for prompts after entry is submitted and AI response is received
  useEffect(() => {
    if (aiResponse && !currentPrompt) {
      const prompt = getNextPrompt({
        isProfileComplete: isProfileComplete(),
        hasActivityLevel: settings.profile.activityLevel !== null,
        todayEntryHasNote: !!submittedNote,
        hasStartedJourney: hasStartedJourney(),
        hasVisitedInsights: hasVisitedInsights(),
      });
      if (prompt) {
        setCurrentPrompt(prompt);
      }
    }
  }, [aiResponse, currentPrompt, getNextPrompt, isProfileComplete, settings.profile.activityLevel, submittedNote, hasStartedJourney, hasVisitedInsights]);

  const handlePromptDismiss = () => {
    if (currentPrompt) {
      dismissPrompt(currentPrompt.id);
      setCurrentPrompt(null);
    }
  };

  const handlePromptAction = () => {
    if (currentPrompt) {
      // For feature discovery prompts, mark as discovered
      if (currentPrompt.id === 'discover-story' || currentPrompt.id === 'discover-insights') {
        markFeatureDiscovered(currentPrompt.id);
      } else {
        dismissPrompt(currentPrompt.id);
      }
      setCurrentPrompt(null);
    }
  };

  const handleSubmit = async () => {
    if (!didMove || !intensity || !feeling) return;

    setIsLoading(true);

    // Track note for prompt system
    const trimmedNote = note.trim() || null;
    setSubmittedNote(trimmedNote);

    // Create the entry
    const entry = createEntry({
      didMove,
      intensity,
      feeling,
      note: trimmedNote,
    });

    // Calculate and award points
    const earned = calculatePointsForEntry(note.trim() || null);
    addPoints(earned);
    setPointsEarned(earned);

    // Record story check-in (auto-starts journey if not started)
    if (!hasStartedJourney()) {
      startJourney();
    }
    const storyProgress = recordCheckIn();
    setStoryUpdate(storyProgress);

    // Generate AI response
    try {
      const response = await generateAIResponse({
        didMove,
        intensity,
        feeling,
        note: note.trim() || null,
        tone: settings.tone,
      });
      setAiResponse(response);
      addAIResponse(entry.id, response);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-slate-600 text-lg">{getToneMessage(settings.tone)}</p>
      </div>

      {/* Question 1: Did you move? */}
      {activeQuestion === 'q1' && (
        <div
          className={`space-y-4 ${
            isExiting ? 'animate-out fade-out slide-out-to-top' : 'animate-in fade-in slide-in-from-bottom'
          } duration-300`}
        >
          <h2
            className="text-2xl font-semibold font-display"
            style={{ color: 'var(--color-text-heading)' }}
          >
            Did you move today?
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <QuestionButton
              label="Yes"
              selected={didMove === 'yes'}
              onClick={() => handleDidMoveAnswer('yes')}
              variant="yes"
            />
            <QuestionButton
              label="Kind of"
              selected={didMove === 'kind-of'}
              onClick={() => handleDidMoveAnswer('kind-of')}
              variant="kind-of"
            />
            <QuestionButton
              label="No"
              selected={didMove === 'no'}
              onClick={() => handleDidMoveAnswer('no')}
              variant="no"
            />
          </div>
        </div>
      )}

      {/* Question 2: How hard was it? */}
      {activeQuestion === 'q2' && (
        <div
          className={`space-y-4 ${
            isExiting ? 'animate-out fade-out slide-out-to-top' : 'animate-in fade-in slide-in-from-bottom'
          } duration-300`}
        >
          <h2
            className="text-2xl font-semibold font-display"
            style={{ color: 'var(--color-text-heading)' }}
          >
            How hard was it?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuestionButton
              label="Easy"
              selected={intensity === 'easy'}
              onClick={() => handleIntensityAnswer('easy')}
            />
            <QuestionButton
              label="Moderate"
              selected={intensity === 'moderate'}
              onClick={() => handleIntensityAnswer('moderate')}
            />
            <QuestionButton
              label="Hard"
              selected={intensity === 'hard'}
              onClick={() => handleIntensityAnswer('hard')}
            />
            <QuestionButton
              label="Exhausting"
              selected={intensity === 'exhausting'}
              onClick={() => handleIntensityAnswer('exhausting')}
            />
          </div>
        </div>
      )}

      {/* Question 3: How do you feel now? */}
      {activeQuestion === 'q3' && (
        <div
          className={`space-y-4 ${
            isExiting ? 'animate-out fade-out slide-out-to-top' : 'animate-in fade-in slide-in-from-bottom'
          } duration-300`}
        >
          <h2
            className="text-2xl font-semibold font-display"
            style={{ color: 'var(--color-text-heading)' }}
          >
            How do you feel now?
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <QuestionButton
              label="Better"
              selected={feeling === 'better'}
              onClick={() => handleFeelingAnswer('better')}
            />
            <QuestionButton
              label="Same"
              selected={feeling === 'same'}
              onClick={() => handleFeelingAnswer('same')}
            />
            <QuestionButton
              label="Worse"
              selected={feeling === 'worse'}
              onClick={() => handleFeelingAnswer('worse')}
            />
          </div>
        </div>
      )}

      {/* Optional note and submit */}
      {activeQuestion === 'complete' && !aiResponse && !isLoading && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-3">
            <p className="text-sm text-slate-500">Add a note (optional)</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="1-2 sentences about today..."
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-mobble-secondary focus:ring-4 focus:ring-mobble-light focus:outline-none resize-none transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            />
            <NoteSuggestions currentNote={note} onSuggestionClick={setNote} />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-4 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
              boxShadow: '0 4px 20px rgba(78, 205, 196, 0.4)',
            }}
          >
            Log Entry
          </button>
        </div>
      )}

      {/* AI Response */}
      <AIResponse response={aiResponse || ''} isLoading={isLoading} />

      {/* Points Earned Badge */}
      {pointsEarned > 0 && aiResponse && (
        <div className="mt-4 text-center animate-in fade-in duration-500">
          <div
            className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 border border-slate-100"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <MobbleEmote
              emote="winkwink"
              animation="sparkle-bounce"
              size="sm"
              alt="Points earned"
            />
            <span
              className="font-semibold"
              style={{ color: 'var(--color-accent)' }}
            >
              +{pointsEarned} points earned!
            </span>
          </div>
        </div>
      )}

      {/* Story Progress Update */}
      {storyUpdate && aiResponse && (storyUpdate.newScene || storyUpdate.arcCompleted) && (
        <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom duration-500 delay-300">
          <div
            className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 border border-slate-100"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <MobbleEmote
              emote={storyUpdate.arcCompleted ? 'wegotthis' : 'happysmile'}
              animation="bounce"
              size="sm"
              alt="Story progress"
            />
            <span
              className="font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              {storyUpdate.arcCompleted
                ? storyUpdate.newArc
                  ? 'Arc complete! New journey awaits!'
                  : 'Journey complete!'
                : 'New scene unlocked!'}
            </span>
          </div>
        </div>
      )}

      {/* In-App Prompt */}
      {currentPrompt && aiResponse && (
        <div className="mt-6">
          <PromptCard
            prompt={currentPrompt}
            onDismiss={handlePromptDismiss}
            onAction={handlePromptAction}
          />
        </div>
      )}
    </div>
  );
};
