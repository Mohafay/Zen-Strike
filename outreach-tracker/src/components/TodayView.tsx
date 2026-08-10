import { BOOLEAN_DEFS, COUNTER_DEFS, TOTAL_ITEMS, completedCount } from '../lib/dailyTemplate';
import { friendlyDate } from '../lib/date';
import type { useDayActions } from '../hooks/useDayActions';
import { ProgressRing } from './ProgressRing';
import { CounterItem } from './CounterItem';
import { CheckboxItem } from './CheckboxItem';
import { DailyLog } from './DailyLog';

interface Props {
  date: string;
  streak: number;
  actions: ReturnType<typeof useDayActions>;
}

export function TodayView({ date, streak, actions }: Props) {
  const { record, bumpCounter, toggleForced, toggleBoolean, setLog } = actions;
  const done = completedCount(record);

  return (
    <div className="flex flex-col gap-6 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-white">{friendlyDate(date)}</p>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <FlameIcon lit={streak > 0} />
            <span>
              {streak} weekday{streak === 1 ? '' : 's'} streak
            </span>
          </div>
        </div>
        <ProgressRing completed={done} total={TOTAL_ITEMS} />
      </header>

      <section className="flex flex-col gap-3">
        <SectionLabel title="Outreach floor" hint="tap +/− · long-press to force done" />
        {COUNTER_DEFS.map((def) => (
          <CounterItem
            key={def.key}
            def={def}
            value={record.counts[def.key]}
            forced={record.forced[def.key]}
            onBump={(delta) => bumpCounter(def.key, delta)}
            onForceToggle={() => toggleForced(def.key)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel title="Daily wins" />
        {BOOLEAN_DEFS.map((def) => (
          <CheckboxItem
            key={def.key}
            label={def.label}
            checked={record.booleans[def.key]}
            onToggle={() => toggleBoolean(def.key)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel title="End-of-day log" />
        <DailyLog record={record} onChange={setLog} />
      </section>
    </div>
  );
}

function SectionLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h2>
      {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
    </div>
  );
}

function FlameIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={lit ? '#f59e0b' : '#7c8896'}>
      <path d="M12 2c1 3-3 4-3 8a3 3 0 006 0c0-1-1-2-1-2 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-6 5-11z" />
    </svg>
  );
}
