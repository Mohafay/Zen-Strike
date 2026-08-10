interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckboxItem({ label, checked, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full select-none items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
        checked ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface active:bg-surface2'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked ? 'border-accent bg-accent' : 'border-border bg-transparent'
        }`}
      >
        {checked && (
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M4 8.3l2.6 2.6 5.4-5.6"
              fill="none"
              stroke="#0b0f14"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12"
              className="animate-check"
            />
          </svg>
        )}
      </span>
      <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-white/90'}`}>{label}</span>
    </button>
  );
}
