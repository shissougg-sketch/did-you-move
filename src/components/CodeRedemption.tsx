import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useEntryStore } from '../stores/entryStore';
import { format, subDays } from 'date-fns';
import type { DidMove, Intensity, Feeling } from '../types/entry';

export const CodeRedemption = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { redeemCode } = useSettingsStore();
  const { createEntryForDate, getEntryByDate } = useEntryStore();

  const generateRandomEntries = () => {
    const didMoveOptions: DidMove[] = ['yes', 'kind-of', 'no'];
    const intensityOptions: Intensity[] = ['easy', 'moderate', 'hard', 'exhausting'];
    const feelingOptions: Feeling[] = ['better', 'same', 'worse'];
    const notes = [
      'Went for a morning walk',
      'Did some stretching',
      'Quick workout at home',
      'Took the stairs today',
      'Walked to grab lunch',
      'Evening jog around the block',
      'Yoga session',
      'Played with the kids',
      'Danced to some music',
      'Bike ride to the store',
      'Swimming at the pool',
      'Hiking trail nearby',
      'Gardening counts, right?',
      'Cleaned the whole house',
      'Rest day, feeling tired',
      null,
      null,
      null,
    ];

    let entriesCreated = 0;
    for (let i = 1; i <= 30; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');

      // Skip if entry already exists for this date
      if (getEntryByDate(date)) {
        continue;
      }

      const didMove = didMoveOptions[Math.floor(Math.random() * didMoveOptions.length)];
      const intensity = didMove !== 'no' ? intensityOptions[Math.floor(Math.random() * intensityOptions.length)] : null;
      const feeling = feelingOptions[Math.floor(Math.random() * feelingOptions.length)];
      const note = notes[Math.floor(Math.random() * notes.length)];

      createEntryForDate(date, {
        didMove,
        intensity,
        feeling,
        note,
      });
      entriesCreated++;
    }

    return entriesCreated;
  };

  const handleRedeem = () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setResult(null);

    const normalizedCode = code.trim().toLowerCase();

    // Handle special "30days" code (always redeemable)
    if (normalizedCode === '30days') {
      const entriesCreated = generateRandomEntries();

      setResult({
        success: true,
        message: `Created ${entriesCreated} random log entries for the past 30 days!`
      });
      setCode('');
      setIsLoading(false);
      return;
    }

    // Handle regular point codes
    const redemptionResult = redeemCode(code);
    setResult(redemptionResult);

    if (redemptionResult.success) {
      setCode('');
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeem();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
      <div className="flex items-center space-x-3 mb-4">
        <Gift className="w-5 h-5 text-slate-700" />
        <div>
          <h3 className="font-semibold text-slate-800">Redeem Code</h3>
          <p className="text-sm text-slate-500">Enter a code to claim rewards</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter code..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mobble-secondary focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleRedeem}
          disabled={!code.trim() || isLoading}
          className="px-4 py-2 bg-mobble-secondary text-white rounded-lg text-sm font-medium hover:bg-mobble-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Redeem
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.success && <Sparkles className="w-4 h-4 text-green-600" />}
          <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
};
