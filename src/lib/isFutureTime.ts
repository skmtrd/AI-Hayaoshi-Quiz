import { isAfter, parseISO } from 'date-fns';

export const isFutureTime = (isoTime: string): boolean => {
  const targetTime = parseISO(isoTime);
  const now = new Date();
  return !isAfter(targetTime, now);
};
