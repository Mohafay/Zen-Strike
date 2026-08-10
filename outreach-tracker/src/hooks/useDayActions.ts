import { useMemo } from 'react';
import { blankDayRecord } from '../lib/dailyTemplate';
import type { BooleanKey, CounterKey, DayRecord, LogKey } from '../types';

export function useDayActions(
  date: string,
  days: Map<string, DayRecord>,
  upsert: (record: DayRecord) => void
) {
  const record = days.get(date) ?? blankDayRecord(date);

  return useMemo(() => {
    const update = (mutator: (r: DayRecord) => DayRecord) => upsert(mutator(record));

    return {
      record,
      bumpCounter: (key: CounterKey, delta: number) =>
        update((r) => ({
          ...r,
          counts: { ...r.counts, [key]: Math.max(0, r.counts[key] + delta) }
        })),
      toggleForced: (key: CounterKey) =>
        update((r) => ({ ...r, forced: { ...r.forced, [key]: !r.forced[key] } })),
      toggleBoolean: (key: BooleanKey) =>
        update((r) => ({ ...r, booleans: { ...r.booleans, [key]: !r.booleans[key] } })),
      setLog: (key: LogKey, value: number) =>
        update((r) => ({ ...r, log: { ...r.log, [key]: Math.max(0, value) } })),
      markReminderFired: () =>
        update((r) => ({ ...r, reminderFiredAt: new Date().toISOString() }))
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, upsert]);
}
