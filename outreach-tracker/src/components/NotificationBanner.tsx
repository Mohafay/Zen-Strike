import { useEffect, useState } from 'react';

interface Props {
  onEnabled: () => void;
}

const DISMISS_KEY = 'outreach-tracker:notif-banner-dismissed';

export function NotificationBanner({ onEnabled }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supported = typeof Notification !== 'undefined';
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
    setVisible(supported && Notification.permission === 'default' && !dismissed);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const enable = async () => {
    const result = await Notification.requestPermission();
    if (result === 'granted') onEnabled();
    dismiss();
  };

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3.5">
      <span className="flex-1 text-xs text-white/90">
        Get an end-of-day nudge for anything still undone?
      </span>
      <button
        type="button"
        onClick={enable}
        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg"
      >
        Enable
      </button>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="px-1 text-muted">
        ✕
      </button>
    </div>
  );
}
