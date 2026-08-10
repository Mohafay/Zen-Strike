import type { DayRecord } from '../types';
import { addDays, isWeekend } from './date';
import { isGroupADone } from './dailyTemplate';

/**
 * Consecutive weekdays (Mon-Fri) with Group A fully hit, counting back from
 * today. Weekends are skipped entirely (never break, never count). Today is
 * given a pass while still in progress: it neither breaks nor extends the
 * streak until it either gets completed or the day ends without completion
 * (at which point tomorrow's calculation will correctly stop at yesterday).
 */
export function computeStreak(byDate: Map<string, DayRecord>, today: string): number {
  let streak = 0;
  let cursor = today;
  let first = true;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isWeekend(cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    const rec = byDate.get(cursor);
    const done = rec ? isGroupADone(rec) : false;

    if (done) {
      streak += 1;
      cursor = addDays(cursor, -1);
      first = false;
      continue;
    }

    if (first && cursor === today) {
      // Today isn't finished yet; don't penalize, just look further back.
      cursor = addDays(cursor, -1);
      first = false;
      continue;
    }

    break;
  }

  return streak;
}
