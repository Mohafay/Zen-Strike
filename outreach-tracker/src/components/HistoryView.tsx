import { addDays, friendlyDate, todayStr } from '../lib/date';
import { isGroupADone } from '../lib/dailyTemplate';
import type { DayRecord } from '../types';
import { CalendarHeatmap } from './CalendarHeatmap';
import { WeeklySummary } from './WeeklySummary';

interface Props {
  days: Map<string, DayRecord>;
}

export function HistoryView({ days }: Props) {
  const today = todayStr();
  const recent: string[] = [];
  for (let i = 0; i < 14; i++) recent.push(addDays(today, -i));

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6">
      <h1 className="text-lg font-semibold">History</h1>
      <WeeklySummary days={days} />
      <CalendarHeatmap days={days} />

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Recent days</h2>
        {recent.map((date) => {
          const record = days.get(date);
          if (!record) {
            return (
              <div key={date} className="rounded-xl border border-border/60 bg-surface/50 p-3 text-sm text-muted">
                {friendlyDate(date)} — no data
              </div>
            );
          }
          const hit = isGroupADone(record);
          return (
            <div
              key={date}
              className={`rounded-xl border p-3 text-sm ${
                hit ? 'border-accent/30 bg-accent/5' : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{friendlyDate(date)}</span>
                <span className={hit ? 'text-accent' : 'text-muted'}>{hit ? 'Floor hit' : 'Below floor'}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted">
                <span>{record.log.totalTouches} touches</span>
                <span>{record.log.replies} replies</span>
                <span>{record.log.callsBooked} calls booked</span>
                <span>{record.log.dealsClosed} deals closed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
