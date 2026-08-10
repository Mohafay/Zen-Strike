import { useState, type ReactNode } from 'react';
import { formatClock, formatDuration } from '../lib/timeFormat';
import { useActiveTimer } from '../hooks/useActiveTimer';
import type { DayRecord, TimeBlockEntry } from '../types';

interface Props {
  record: DayRecord;
  notificationsEnabled: boolean;
  onSaveBlock: (entry: TimeBlockEntry) => void;
}

const LABEL_PRESETS = ['Cold emails', 'LinkedIn', 'Follow-ups', 'Upwork', 'Content', 'Admin'];
const DURATION_PRESETS = [
  { label: '25m', seconds: 25 * 60 },
  { label: '50m', seconds: 50 * 60 },
  { label: '1h', seconds: 60 * 60 },
  { label: '2h', seconds: 120 * 60 }
];

export function TimerView({ record, notificationsEnabled, onSaveBlock }: Props) {
  const { timer, elapsed, remaining, start, pause, resume, cancel, finish } =
    useActiveTimer(notificationsEnabled);

  const todaysBlocks = record.timeBlocks;
  const todaysTotal = todaysBlocks.reduce((s, b) => s + b.actualSeconds, 0);

  const stopAndSave = () => {
    const entry = finish();
    if (entry) onSaveBlock(entry);
  };

  return (
    <div className="flex flex-col gap-6 px-4 pb-28 pt-6">
      <h1 className="text-lg font-semibold">Timer</h1>

      {timer ? (
        <ActiveTimerCard
          label={timer.label}
          plannedSeconds={timer.plannedSeconds}
          elapsed={elapsed}
          remaining={remaining}
          running={timer.running}
          onPause={pause}
          onResume={resume}
          onStop={stopAndSave}
          onCancel={cancel}
        />
      ) : (
        <StartTimerCard onStart={start} />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Today&apos;s blocks
          </h2>
          {todaysTotal > 0 && (
            <span className="text-[11px] text-muted">{formatDuration(todaysTotal)} total</span>
          )}
        </div>

        {todaysBlocks.length === 0 && (
          <p className="rounded-xl border border-border bg-surface p-3 text-sm text-muted">
            Nothing logged yet — start a block above.
          </p>
        )}

        {[...todaysBlocks].reverse().map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-sm"
          >
            <span className="font-medium">{b.label}</span>
            <span className="tabular-nums text-muted">
              {formatDuration(b.actualSeconds)}
              {b.actualSeconds < b.plannedSeconds * 0.95 ? ' (cut short)' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartTimerCard({ onStart }: { onStart: (label: string, plannedSeconds: number) => void }) {
  const [label, setLabel] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [seconds, setSeconds] = useState(DURATION_PRESETS[2].seconds);
  const [customMinutes, setCustomMinutes] = useState('');

  const effectiveLabel = label === 'custom' ? customLabel.trim() : label;
  const canStart = effectiveLabel.length > 0 && seconds > 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Block this time for
        </p>
        <div className="flex flex-wrap gap-2">
          {LABEL_PRESETS.map((l) => (
            <Chip key={l} active={label === l} onClick={() => setLabel(l)}>
              {l}
            </Chip>
          ))}
          <Chip active={label === 'custom'} onClick={() => setLabel('custom')}>
            Custom
          </Chip>
        </div>
        {label === 'custom' && (
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="What are you blocking time for?"
            className="mt-2 w-full rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-white outline-none placeholder:text-muted"
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">For how long</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((d) => (
            <Chip
              key={d.label}
              active={customMinutes === '' && seconds === d.seconds}
              onClick={() => {
                setCustomMinutes('');
                setSeconds(d.seconds);
              }}
            >
              {d.label}
            </Chip>
          ))}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="mins"
              value={customMinutes}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '');
                setCustomMinutes(v);
                if (v) setSeconds(Number(v) * 60);
              }}
              className="w-16 rounded-lg border border-border bg-surface2 px-2 py-1.5 text-center text-sm text-white outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canStart}
        onClick={() => canStart && onStart(effectiveLabel, seconds)}
        className="rounded-xl bg-accent py-3.5 text-sm font-semibold text-bg disabled:opacity-40"
      >
        Start {formatDuration(seconds)} block
      </button>
    </div>
  );
}

function ActiveTimerCard({
  label,
  plannedSeconds,
  elapsed,
  remaining,
  running,
  onPause,
  onResume,
  onStop,
  onCancel
}: {
  label: string;
  plannedSeconds: number;
  elapsed: number;
  remaining: number;
  running: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCancel: () => void;
}) {
  const overtime = remaining <= 0;
  const pct = Math.min(1, elapsed / plannedSeconds);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-6">
      <p className="text-sm font-medium text-white/90">{label}</p>

      <div className="text-5xl font-semibold tabular-nums">
        {overtime ? `+${formatClock(elapsed - plannedSeconds)}` : formatClock(remaining)}
      </div>
      <p className="text-xs text-muted">
        {overtime ? 'over planned time' : `of ${formatDuration(plannedSeconds)} planned`}
      </p>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            overtime ? 'bg-warn' : 'bg-accent'
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <div className="flex w-full items-center gap-2">
        {running ? (
          <button
            type="button"
            onClick={onPause}
            className="flex-1 rounded-xl bg-surface2 py-3 text-sm font-medium text-white active:bg-border"
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={onResume}
            className="flex-1 rounded-xl bg-surface2 py-3 text-sm font-medium text-white active:bg-border"
          >
            Resume
          </button>
        )}
        <button
          type="button"
          onClick={onStop}
          className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-bg"
        >
          Stop &amp; save
        </button>
      </div>
      <button type="button" onClick={onCancel} className="text-xs text-muted underline underline-offset-2">
        Discard without saving
      </button>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-accent bg-accent text-bg'
          : 'border-border bg-surface2 text-white/80 active:bg-border'
      }`}
    >
      {children}
    </button>
  );
}
