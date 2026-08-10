import { LOG_DEFS } from '../lib/dailyTemplate';
import type { DayRecord, LogKey } from '../types';

interface Props {
  record: DayRecord;
  onChange: (key: LogKey, value: number) => void;
}

export function DailyLog({ record, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {LOG_DEFS.map((def) => (
        <label
          key={def.key}
          className="flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-3.5"
        >
          <span className="text-xs text-muted">{def.label}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={record.log[def.key]}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => onChange(def.key, Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
            className="w-full bg-transparent text-2xl font-semibold tabular-nums text-white outline-none"
          />
        </label>
      ))}
    </div>
  );
}
