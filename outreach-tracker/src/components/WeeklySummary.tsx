import { daysInRange, todayStr, weekStart } from '../lib/date';
import { isGroupADone } from '../lib/dailyTemplate';
import { formatDuration } from '../lib/timeFormat';
import type { DayRecord } from '../types';

interface Props {
  days: Map<string, DayRecord>;
}

// Weekly summary is deliberately input-only (touches, floor-hit days, time
// invested) — no outcome/result metrics like reply rate.
export function WeeklySummary({ days }: Props) {
  const today = todayStr();
  const start = weekStart(today);
  const weekDates = daysInRange(start, today);
  const weekRecords = weekDates.map((d) => days.get(d)).filter((r): r is DayRecord => !!r);

  const touches = weekRecords.reduce((sum, r) => sum + r.log.totalTouches, 0);
  const timeSeconds = weekRecords.reduce(
    (sum, r) => sum + r.timeBlocks.reduce((s, b) => s + b.actualSeconds, 0),
    0
  );
  const floorHitDays = weekRecords.filter(isGroupADone).length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">This week</h3>
        <span className="text-[11px] text-muted">since Mon {start.slice(5)}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Touches" value={touches} />
        <Stat label="Time logged" value={formatDuration(timeSeconds)} />
        <Stat label="Floor hit days" value={`${floorHitDays}/${weekDates.length}`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-surface2 p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
