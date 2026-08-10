import { useRef, useState } from 'react';

interface Props {
  label: string;
  target: number;
  value: number;
  forced: boolean;
  onBump: (delta: number) => void;
  onForceToggle: () => void;
}

const LONG_PRESS_MS = 550;

export function CounterItem({ label, target, value, forced, onBump, onForceToggle }: Props) {
  const done = forced || value >= target;
  const pct = Math.min(1, value / target);
  const [pressing, setPressing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setPressing(false);
      onForceToggle();
      if (navigator.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = () => {
    clearTimer();
    setPressing(false);
  };

  const triggerBump = (delta: number) => {
    onBump(delta);
    const willBeDone = !done && value + delta >= target;
    if (willBeDone) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 300);
    }
  };

  return (
    <div
      className={`select-none rounded-2xl border p-4 transition-colors ${
        done ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface'
      } ${pressing ? 'scale-[0.98]' : ''} ${justCompleted ? 'animate-pop' : ''}`}
      style={{ transition: 'transform 120ms ease-out, background-color 200ms, border-color 200ms' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-white">{label}</p>
            {done && <CheckBadge />}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                done ? 'bg-accent' : 'bg-accent2'
              }`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              triggerBump(-1);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface2 text-xl text-muted active:bg-border"
          >
            −
          </button>
          <div className="w-14 text-center">
            <span className="text-xl font-semibold tabular-nums">{value}</span>
            <span className="text-xs text-muted">/{target}</span>
          </div>
          <button
            type="button"
            aria-label={`Increase ${label}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              triggerBump(1);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/90 text-xl font-medium text-bg active:bg-accent"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
      <circle cx="8" cy="8" r="8" fill="#22c55e" />
      <path
        d="M4.5 8.3l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="#0b0f14"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10"
        className="animate-check"
      />
    </svg>
  );
}
