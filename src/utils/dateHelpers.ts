import { format, parseISO, isToday, differenceInDays, subDays, addDays, startOfDay, isBefore, isAfter } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d');
  } catch {
    return dateString;
  }
};

export const getDaysAgo = (dateString: string): number => {
  try {
    const date = parseISO(dateString);
    return differenceInDays(new Date(), date);
  } catch {
    return 0;
  }
};

export const isDateToday = (dateString: string): boolean => {
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
};

// Calendar helpers

export const getCalendarDays = (centerDate: Date, daysToShow: number = 7): Date[] => {
  const halfDays = Math.floor(daysToShow / 2);
  const days: Date[] = [];
  for (let i = -halfDays; i <= halfDays; i++) {
    days.push(addDays(centerDate, i));
  }
  return days;
};

export const canCreateBackdatedEntry = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 7);

  return !isBefore(date, sevenDaysAgo) && !isAfter(date, today);
};

export const isBackdatedDate = (dateString: string): boolean => {
  return !isToday(parseISO(dateString));
};

export const formatDayOfWeek = (date: Date): string => {
  return format(date, 'EEE');
};

export const formatDayNumber = (date: Date): string => {
  return format(date, 'd');
};

export const formatDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const isFutureDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const today = startOfDay(new Date());
  return isAfter(date, today);
};
