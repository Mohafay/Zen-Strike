export type CounterKey = 'linkedin' | 'emails' | 'followups' | 'upworkApplications';
export type BooleanKey = 'bookedCall' | 'postedContent';
export type LogKey = 'totalTouches';

export interface CounterDef {
  key: CounterKey;
  label: string;
  target: number;
}

export interface BooleanDef {
  key: BooleanKey;
  label: string;
}

export interface LogDef {
  key: LogKey;
  label: string;
}

export interface TimeBlockEntry {
  id: string;
  label: string;
  plannedSeconds: number;
  actualSeconds: number;
  startedAt: string; // ISO timestamp
  endedAt: string; // ISO timestamp
}

export interface DayRecord {
  date: string; // YYYY-MM-DD, local time
  counts: Record<CounterKey, number>;
  forced: Record<CounterKey, boolean>; // long-press "force done" override
  booleans: Record<BooleanKey, boolean>;
  log: Record<LogKey, number>;
  timeBlocks: TimeBlockEntry[];
  reminderFiredAt: string | null; // ISO timestamp, once per day
  updatedAt: string; // ISO timestamp
}

export interface Settings {
  reminderTime: string; // "HH:MM" 24h local
  notificationsEnabled: boolean;
  remindersOn: boolean;
}

// Persisted separately (localStorage, not IndexedDB) since it's ephemeral
// live state, not historical data — elapsed time is always recomputed from
// wall-clock timestamps so it survives reloads/backgrounding correctly.
export interface ActiveTimer {
  id: string;
  label: string;
  plannedSeconds: number;
  startedAt: number; // epoch ms of the current running segment's start
  accumulatedSeconds: number; // seconds banked from segments before the current one
  running: boolean;
  notifiedComplete: boolean;
}
