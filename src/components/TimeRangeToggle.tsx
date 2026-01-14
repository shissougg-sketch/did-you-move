import type { TimeRange } from '../utils/insightsCalculator';

interface TimeRangeToggleProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeToggle = ({ selected, onChange }: TimeRangeToggleProps) => {
  return (
    <div
      className="flex bg-white/95 backdrop-blur-sm rounded-xl p-1 border border-white/20"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      <button
        onClick={() => onChange('weekly')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          selected === 'weekly' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
        }`}
        style={
          selected === 'weekly'
            ? {
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                boxShadow: '0 4px 12px rgba(78, 205, 196, 0.4)',
              }
            : undefined
        }
      >
        Last 7 Days
      </button>
      <button
        onClick={() => onChange('monthly')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          selected === 'monthly' ? 'text-white' : 'text-slate-500 hover:text-slate-700'
        }`}
        style={
          selected === 'monthly'
            ? {
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                boxShadow: '0 4px 12px rgba(78, 205, 196, 0.4)',
              }
            : undefined
        }
      >
        Last 30 Days
      </button>
    </div>
  );
};
