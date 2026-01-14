import { memo } from 'react';
import { isToday } from 'date-fns';
import { formatDayOfWeek, formatDayNumber } from '../utils/dateHelpers';
import type { DailyEntry, DidMove } from '../types/entry';

interface DayCellProps {
  date: Date;
  isSelected: boolean;
  entry?: DailyEntry;
  onSelect: () => void;
  disabled?: boolean;
}

const getEntryDotColor = (didMove: DidMove) => {
  switch (didMove) {
    case 'yes':
      return 'bg-moved-yes';
    case 'kind-of':
      return 'bg-moved-kind-of';
    case 'no':
      return 'bg-moved-no';
  }
};

export const DayCell = memo(function DayCell({
  date,
  isSelected,
  entry,
  onSelect,
  disabled = false,
}: DayCellProps) {
  const today = isToday(date);

  const baseClasses = 'flex flex-col items-center py-2 px-3 rounded-xl transition-all';
  const selectedClasses = isSelected
    ? 'bg-slate-800 text-white'
    : 'bg-white hover:bg-slate-100';
  const todayClasses = !isSelected && today ? 'ring-2 ring-slate-400' : '';
  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`${baseClasses} ${selectedClasses} ${todayClasses} ${disabledClasses}`}
    >
      <span
        className={`text-xs font-medium ${
          isSelected ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        {formatDayOfWeek(date)}
      </span>
      <span className="text-lg font-semibold mt-1">{formatDayNumber(date)}</span>
      {entry ? (
        <div
          className={`w-2 h-2 rounded-full mt-1 ${getEntryDotColor(entry.didMove)}`}
        />
      ) : (
        <div className="w-2 h-2 mt-1" />
      )}
    </button>
  );
});
