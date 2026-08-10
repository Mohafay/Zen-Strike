interface Props {
  completed: number;
  total: number;
  size?: number;
}

export function ProgressRing({ completed, total, size = 88 }: Props) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(1, completed / total) : 0;
  const offset = circumference * (1 - pct);
  const isComplete = total > 0 && completed >= total;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a222b"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? '#22c55e' : '#34d399'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold leading-none">
          {completed}/{total}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-muted mt-1">done</span>
      </div>
    </div>
  );
}
