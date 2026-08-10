export type CounterKey = 'linkedin' | 'emails' | 'followups' | 'loomAudits';
export type BooleanKey = 'bookedCall' | 'postedContent';
export type LogKey = 'totalTouches' | 'replies' | 'callsBooked' | 'dealsClosed';

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

export interface DayRecord {
  date: string; // YYYY-MM-DD, local time
  counts: Record<CounterKey, number>;
  forced: Record<CounterKey, boolean>; // long-press "force done" override
  booleans: Record<BooleanKey, boolean>;
  log: Record<LogKey, number>;
  reminderFiredAt: string | null; // ISO timestamp, once per day
  updatedAt: string; // ISO timestamp
}

export interface Settings {
  reminderTime: string; // "HH:MM" 24h local
  notificationsEnabled: boolean;
  remindersOn: boolean;
}
