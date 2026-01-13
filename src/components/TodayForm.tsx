import { useState } from 'react';
import { QuestionButton } from './QuestionButton';
import { AIResponse } from './AIResponse';
import type { DidMove, Intensity, Feeling } from '../types/entry';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import { getToneMessage } from '../utils/toneMessages';
import { generateAIResponse } from '../utils/aiClient';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const TodayForm = () => {
  const { settings } = useSettingsStore();
  const createEntry = useEntryStore((state) => state.createEntry);
  const addAIResponse = useEntryStore((state) => state.addAIResponse);

  const [didMove, setDidMove] = useState<DidMove | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!didMove || !intensity || !feeling) return;

    setIsLoading(true);

    // Create the entry
    const entry = createEntry({
      didMove,
      intensity,
      feeling,
      note: note.trim() || null,
    });

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

  // Auto-submit when all required questions are answered
  if (didMove && intensity && feeling && !aiResponse && !isLoading) {
    handleSubmit();
  }

  const isComplete = didMove && intensity && feeling;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-slate-600 text-lg">{getToneMessage(settings.tone)}</p>
      </div>

      {/* Question 1: Did you move? */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Did you move today?</h2>
        <div className="grid grid-cols-1 gap-3">
          <QuestionButton
            label="Yes"
            selected={didMove === 'yes'}
            onClick={() => setDidMove('yes')}
            variant="yes"
          />
          <QuestionButton
            label="Kind of"
            selected={didMove === 'kind-of'}
            onClick={() => setDidMove('kind-of')}
            variant="kind-of"
          />
          <QuestionButton
            label="No"
            selected={didMove === 'no'}
            onClick={() => setDidMove('no')}
            variant="no"
          />
        </div>
      </div>

      {/* Question 2: How hard was it? */}
      {didMove && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <h2 className="text-2xl font-semibold text-slate-800">How hard was it?</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuestionButton
              label="Easy"
              selected={intensity === 'easy'}
              onClick={() => setIntensity('easy')}
            />
            <QuestionButton
              label="Moderate"
              selected={intensity === 'moderate'}
              onClick={() => setIntensity('moderate')}
            />
            <QuestionButton
              label="Hard"
              selected={intensity === 'hard'}
              onClick={() => setIntensity('hard')}
            />
            <QuestionButton
              label="Exhausting"
              selected={intensity === 'exhausting'}
              onClick={() => setIntensity('exhausting')}
            />
          </div>
        </div>
      )}

      {/* Question 3: How do you feel now? */}
      {didMove && intensity && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <h2 className="text-2xl font-semibold text-slate-800">How do you feel now?</h2>
          <div className="grid grid-cols-1 gap-3">
            <QuestionButton
              label="Better"
              selected={feeling === 'better'}
              onClick={() => setFeeling('better')}
            />
            <QuestionButton
              label="Same"
              selected={feeling === 'same'}
              onClick={() => setFeeling('same')}
            />
            <QuestionButton
              label="Worse"
              selected={feeling === 'worse'}
              onClick={() => setFeeling('worse')}
            />
          </div>
        </div>
      )}

      {/* Optional note */}
      {isComplete && !aiResponse && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <button
            onClick={() => setShowNote(!showNote)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <span className="text-sm font-medium">Add a note (optional)</span>
            {showNote ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showNote && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="1-2 sentences about today..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-300 focus:ring-offset-2 focus:outline-none resize-none"
            />
          )}
        </div>
      )}

      {/* AI Response */}
      <AIResponse response={aiResponse || ''} isLoading={isLoading} />
    </div>
  );
};
