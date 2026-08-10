import type { BooleanDef, CounterDef, DayRecord, LogDef, Settings } from '../types';

// Hardcoded daily checklist template. Edit these values to change targets/wording.
export const COUNTER_DEFS: CounterDef[] = [
  { key: 'linkedin', label: 'LinkedIn connection requests', target: 20 },
  { key: 'emails', label: 'Personalized emails sent', target: 34 },
  { key: 'followups', label: 'Follow-ups sent', target: 20 },
  { key: 'loomAudits', label: 'Loom audits on top prospects', target: 5 }
];

export const BOOLEAN_DEFS: BooleanDef[] = [
  { key: 'bookedCall', label: 'Booked 1 call' },
  { key: 'postedContent', label: 'Posted 1 piece of content' }
];

export const LOG_DEFS: LogDef[] = [
  { key: 'totalTouches', label: 'Total touches' },
  { key: 'replies', label: 'Replies' },
  { key: 'callsBooked', label: 'Calls booked' },
  { key: 'dealsClosed', label: 'Deals closed' }
];

export const DEFAULT_SETTINGS: Settings = {
  reminderTime: '18:00',
  notificationsEnabled: false,
  remindersOn: true
};

export function blankDayRecord(date: string): DayRecord {
  return {
    date,
    counts: { linkedin: 0, emails: 0, followups: 0, loomAudits: 0 },
    forced: { linkedin: false, emails: false, followups: false, loomAudits: false },
    booleans: { bookedCall: false, postedContent: false },
    log: { totalTouches: 0, replies: 0, callsBooked: 0, dealsClosed: 0 },
    reminderFiredAt: null,
    updatedAt: new Date().toISOString()
  };
}

export function isCounterDone(record: DayRecord, key: CounterDef['key']): boolean {
  const def = COUNTER_DEFS.find((d) => d.key === key)!;
  return record.forced[key] || record.counts[key] >= def.target;
}

export function isGroupADone(record: DayRecord): boolean {
  return COUNTER_DEFS.every((d) => isCounterDone(record, d.key));
}

export function isGroupBDone(record: DayRecord): boolean {
  return BOOLEAN_DEFS.every((d) => record.booleans[d.key]);
}

export function completedCount(record: DayRecord): number {
  const a = COUNTER_DEFS.filter((d) => isCounterDone(record, d.key)).length;
  const b = BOOLEAN_DEFS.filter((d) => record.booleans[d.key]).length;
  return a + b;
}

export const TOTAL_ITEMS = COUNTER_DEFS.length + BOOLEAN_DEFS.length;

export function missingItemsSummary(record: DayRecord): string[] {
  const missing: string[] = [];
  for (const d of COUNTER_DEFS) {
    if (!isCounterDone(record, d.key)) {
      const remaining = Math.max(0, d.target - record.counts[d.key]);
      missing.push(`${remaining} ${d.label.toLowerCase()}`);
    }
  }
  for (const d of BOOLEAN_DEFS) {
    if (!record.booleans[d.key]) missing.push(d.label.toLowerCase());
  }
  return missing;
}
