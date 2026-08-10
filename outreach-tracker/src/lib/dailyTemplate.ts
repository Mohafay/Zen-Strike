import { daysBetween, todayStr } from './date';
import type { BooleanDef, CounterDef, DayRecord, LogDef, Settings } from '../types';

// Ramp: week 1 = 10/day, week 2 = 20/day, week 3+ = 34/day, counted in
// 7-day blocks from Settings.startDate (locked in on first launch).
function emailsTarget(date: string, startDate: string): number {
  const daysIn = Math.max(0, daysBetween(startDate, date));
  const week = Math.floor(daysIn / 7) + 1;
  if (week <= 1) return 10;
  if (week === 2) return 20;
  return 34;
}

// Hardcoded daily checklist template. Edit these values to change targets/wording.
export const FLOOR_COUNTER_DEFS: CounterDef[] = [
  { key: 'linkedin', label: 'LinkedIn connection requests', getTarget: () => 20 },
  { key: 'emails', label: 'Personalized emails sent', getTarget: emailsTarget },
  // No target was given for this one — 3/day is a placeholder, edit freely.
  { key: 'upworkApplications', label: 'Upwork applications', getTarget: () => 3 }
];

// Also mandatory (part of the outreach floor), but a plain yes/no tick
// rather than a counter — the real number varies day to day.
export const FLOOR_BOOLEAN_DEFS: BooleanDef[] = [
  { key: 'followupsCaughtUp', label: 'Caught up on follow-ups' }
];

export const WIN_BOOLEAN_DEFS: BooleanDef[] = [
  { key: 'bookedCall', label: 'Booked 1 call' },
  { key: 'postedContent', label: 'Posted 1 piece of content' }
];

export const LOG_DEFS: LogDef[] = [{ key: 'totalTouches', label: 'Total touches' }];

export const DEFAULT_SETTINGS: Settings = {
  reminderTime: '18:00',
  notificationsEnabled: false,
  remindersOn: true,
  startDate: todayStr()
};

export function blankDayRecord(date: string): DayRecord {
  return {
    date,
    counts: { linkedin: 0, emails: 0, upworkApplications: 0 },
    forced: { linkedin: false, emails: false, upworkApplications: false },
    booleans: { followupsCaughtUp: false, bookedCall: false, postedContent: false },
    log: { totalTouches: 0 },
    timeBlocks: [],
    reminderFiredAt: null,
    updatedAt: new Date().toISOString()
  };
}

export function counterTarget(key: CounterDef['key'], date: string, startDate: string): number {
  return FLOOR_COUNTER_DEFS.find((d) => d.key === key)!.getTarget(date, startDate);
}

export function isCounterDone(record: DayRecord, key: CounterDef['key'], startDate: string): boolean {
  return record.forced[key] || record.counts[key] >= counterTarget(key, record.date, startDate);
}

export function isGroupADone(record: DayRecord, startDate: string): boolean {
  const countersDone = FLOOR_COUNTER_DEFS.every((d) => isCounterDone(record, d.key, startDate));
  const floorChecksDone = FLOOR_BOOLEAN_DEFS.every((d) => record.booleans[d.key]);
  return countersDone && floorChecksDone;
}

export function completedCount(record: DayRecord, startDate: string): number {
  const a = FLOOR_COUNTER_DEFS.filter((d) => isCounterDone(record, d.key, startDate)).length;
  const b = FLOOR_BOOLEAN_DEFS.filter((d) => record.booleans[d.key]).length;
  const c = WIN_BOOLEAN_DEFS.filter((d) => record.booleans[d.key]).length;
  return a + b + c;
}

export const TOTAL_ITEMS = FLOOR_COUNTER_DEFS.length + FLOOR_BOOLEAN_DEFS.length + WIN_BOOLEAN_DEFS.length;

export function missingItemsSummary(record: DayRecord, startDate: string): string[] {
  const missing: string[] = [];
  for (const d of FLOOR_COUNTER_DEFS) {
    if (!isCounterDone(record, d.key, startDate)) {
      const target = counterTarget(d.key, record.date, startDate);
      const remaining = Math.max(0, target - record.counts[d.key]);
      missing.push(`${remaining} ${d.label.toLowerCase()}`);
    }
  }
  for (const d of FLOOR_BOOLEAN_DEFS) {
    if (!record.booleans[d.key]) missing.push(d.label.toLowerCase());
  }
  for (const d of WIN_BOOLEAN_DEFS) {
    if (!record.booleans[d.key]) missing.push(d.label.toLowerCase());
  }
  return missing;
}
