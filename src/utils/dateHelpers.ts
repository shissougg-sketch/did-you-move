import { format, parseISO, isToday, differenceInDays } from 'date-fns';

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
