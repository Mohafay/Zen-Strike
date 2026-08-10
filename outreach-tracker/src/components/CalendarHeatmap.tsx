import { useState } from 'react';
import { isOptionalDay, monthGrid, monthLabel, parseDateStr, todayStr } from '../lib/date';
import { isGroupADone } from '../lib/dailyTemplate';
import type { DayRecord } from '../types';

interface Props {
  days: Map<string, DayRecord>;
}

const WEEKDAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function CalendarHeatmap({ days }: Props) {
  const now = parseDateStr(todayStr());
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const today = todayStr();
  const weeks = monthGrid(cursor.year, cursor.month);

  const shiftMonth = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-surface2"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="text-sm font-medium">{monthLabel(cursor.year, cursor.month)}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-surface2"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_HEADERS.map((h, i) => (
          <div key={i} className="text-center text-[10px] text-muted">
            {h}
          </div>
        ))}
        {weeks.flat().map((date, i) => (
          <DayCell key={i} date={date} record={date ? days.get(date) : undefined} isToday={date === today} />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted">
        <Legend swatchClass="bg-accent" label="floor hit" />
        <Legend swatchClass="bg-warn/70" label="logged" />
        <Legend swatchClass="bg-surface2" label="no data" />
      </div>
    </div>
  );
}

function DayCell({
  date,
  record,
  isToday
}: {
  date: string | null;
  record: DayRecord | undefined;
  isToday: boolean;
}) {
  if (!date) return <div />;
  const optional = isOptionalDay(date);
  const dayNum = Number(date.slice(-2));

  let bg = 'bg-surface2';
  if (record) {
    bg = isGroupADone(record) ? 'bg-accent' : 'bg-warn/70';
  }

  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-md text-[11px] ${bg} ${
        optional ? 'opacity-50' : ''
      } ${isToday ? 'ring-1 ring-white/70' : ''}`}
      title={date}
    >
      <span className={record ? 'text-bg font-medium' : 'text-muted'}>{dayNum}</span>
    </div>
  );
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-sm ${swatchClass}`} />
      {label}
    </span>
  );
}
