export type Tab = 'today' | 'timer' | 'history' | 'settings';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string; icon: (active: boolean) => JSX.Element }[] = [
  { key: 'today', label: 'Today', icon: (a) => <TodayIcon active={a} /> },
  { key: 'timer', label: 'Timer', icon: (a) => <TimerIcon active={a} /> },
  { key: 'history', label: 'History', icon: (a) => <HistoryIcon active={a} /> },
  { key: 'settings', label: 'Settings', icon: (a) => <SettingsIcon active={a} /> }
];

export function NavTabs({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs"
            >
              {t.icon(isActive)}
              <span className={isActive ? 'text-white' : 'text-muted'}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function TodayIcon({ active }: { active: boolean }) {
  const c = active ? '#22c55e' : '#7c8896';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <rect x="4" y="5" width="16" height="16" rx="2.5" />
      <path d="M9 3v4M15 3v4M8 13l2.5 2.5L16 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimerIcon({ active }: { active: boolean }) {
  const c = active ? '#22c55e' : '#7c8896';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5h5M12 5v-2.5" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  const c = active ? '#22c55e' : '#7c8896';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <rect x="3.5" y="4" width="17" height="17" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" strokeLinecap="round" />
      <rect x="6.3" y="12" width="2.6" height="2.6" fill={c} stroke="none" />
      <rect x="10.7" y="12" width="2.6" height="2.6" fill={c} stroke="none" />
      <rect x="15.1" y="12" width="2.6" height="2.6" fill={c} stroke="none" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  const c = active ? '#22c55e' : '#7c8896';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
