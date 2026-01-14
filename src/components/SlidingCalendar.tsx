import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseISO, addDays, subDays, startOfDay, isAfter, isBefore } from 'date-fns';
import { DayCell } from './DayCell';
import { getCalendarDays, formatDateString } from '../utils/dateHelpers';
import type { DailyEntry } from '../types/entry';

interface SlidingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  entries: DailyEntry[];
}

export const SlidingCalendar = ({
  selectedDate,
  onDateSelect,
  entries,
}: SlidingCalendarProps) => {
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 7);

  const [centerDate, setCenterDate] = useState(() => parseISO(selectedDate));

  const days = useMemo(() => getCalendarDays(centerDate, 7), [centerDate]);

  const entryMap = useMemo(() => {
    const map = new Map<string, DailyEntry>();
    entries.forEach((entry) => {
      map.set(entry.date, entry);
    });
    return map;
  }, [entries]);

  const canGoBack = useMemo(() => {
    const leftmostDay = days[0];
    return isAfter(leftmostDay, sevenDaysAgo);
  }, [days, sevenDaysAgo]);

  const canGoForward = useMemo(() => {
    const rightmostDay = days[days.length - 1];
    return isBefore(rightmostDay, today);
  }, [days, today]);

  const handlePrevious = () => {
    if (canGoBack) {
      setCenterDate((prev) => subDays(prev, 7));
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setCenterDate((prev) => addDays(prev, 7));
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, sevenDaysAgo) || isAfter(date, today);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={!canGoBack}
          className={`p-2 rounded-lg transition-colors ${
            canGoBack
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex space-x-1 overflow-hidden">
          {days.map((date) => {
            const dateString = formatDateString(date);
            return (
              <DayCell
                key={dateString}
                date={date}
                isSelected={dateString === selectedDate}
                entry={entryMap.get(dateString)}
                onSelect={() => onDateSelect(dateString)}
                disabled={isDateDisabled(date)}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoForward}
          className={`p-2 rounded-lg transition-colors ${
            canGoForward
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
