import { daysInRange, todayStr, weekStart } from '../lib/date';
import { isGroupADone } from '../lib/dailyTemplate';
import type { DayRecord } from '../types';

interface Props {
  days: Map<string, DayRecord>;
}

export function WeeklySummary({ days }: Props) {
  const today = todayStr();
  const start = weekStart(today);
  const weekDates = daysInRange(start, today);
  const weekRecords = weekDates.map((d) => days.get(d)).filter((r): r is DayRecord => !!r);

  const totals = weekRecords.reduce(
    (acc, r) => ({
      touches: acc.touches + r.log.totalTouches,
      replies: acc.replies + r.log.replies,
      callsBooked: acc.callsBooked + r.log.callsBooked,
      dealsClosed: acc.dealsClosed + r.log.dealsClosed
    }),
    { touches: 0, replies: 0, callsBooked: 0, dealsClosed: 0 }
  );

  const replyRate = totals.touches > 0 ? (totals.replies / totals.touches) * 100 : 0;
  const floorHitDays = weekRecords.filter(isGroupADone).length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">This week</h3>
        <span className="text-[11px] text-muted">since Mon {start.slice(5)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Touches" value={totals.touches} />
        <Stat label="Replies" value={totals.replies} />
        <Stat label="Reply rate" value={`${replyRate.toFixed(1)}%`} />
        <Stat label="Calls booked" value={totals.callsBooked} />
        <Stat label="Deals closed" value={totals.dealsClosed} />
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
