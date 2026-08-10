import { useEffect, useState } from 'react';
import { todayStr } from '../lib/date';

/**
 * Tracks the current local calendar date, re-checking on an interval and on
 * tab focus/visibility so a checklist left open overnight rolls to a fresh
 * day automatically instead of requiring a manual refresh.
 */
export function useToday(): string {
  const [date, setDate] = useState(todayStr());

  useEffect(() => {
    const check = () => {
      const t = todayStr();
      setDate((prev) => (prev === t ? prev : t));
    };
    const interval = setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
    };
  }, []);

  return date;
}
