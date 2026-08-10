import { useEffect, useState } from 'react';
import type { Settings } from '../types';

interface Props {
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
}

export function SettingsView({ settings, onUpdate }: Props) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );

  useEffect(() => {
    if (permission === 'granted' && !settings.notificationsEnabled) {
      onUpdate({ notificationsEnabled: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
    onUpdate({ notificationsEnabled: result === 'granted' });
  };

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      <section className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">End-of-day reminder</h2>
        <p className="mt-1 text-xs text-muted">
          If anything in the outreach floor or daily wins is still undone at this time, you'll get a
          notification listing exactly what's left.
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">Enabled</span>
          <ToggleSwitch
            checked={settings.remindersOn}
            onChange={(v) => onUpdate({ remindersOn: v })}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">Remind me at</span>
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => onUpdate({ reminderTime: e.target.value })}
            className="rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          {permission === 'unsupported' && (
            <p className="text-xs text-warn">Notifications aren't supported in this browser.</p>
          )}
          {permission === 'granted' && (
            <p className="text-xs text-accent">Notifications are enabled.</p>
          )}
          {permission === 'denied' && (
            <p className="text-xs text-danger">
              Notifications are blocked. Enable them for this site in your browser/OS settings.
            </p>
          )}
          {permission === 'default' && (
            <button
              type="button"
              onClick={requestPermission}
              className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-bg active:opacity-90"
            >
              Enable notifications
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted">
        <h2 className="mb-1 text-sm font-semibold text-white">Reliability notes</h2>
        <p>
          Reminders fire from inside the app with no server or push service behind them, so the app
          needs to be open (or recently open, in the background) around your reminder time.
        </p>
        <p className="mt-2">
          <span className="text-white">Android / desktop:</span> reliable once installed as a PWA
          and opened at least occasionally near your reminder time.
        </p>
        <p className="mt-2">
          <span className="text-white">iOS:</span> Safari suspends background tabs and PWAs
          aggressively, so a reminder may only appear once you actually open the app. Add it to
          your home screen and consider glancing at it once in the evening.
        </p>
        <p className="mt-2">
          For guaranteed phone reminders regardless of whether the app is open, see the optional
          Telegram bot section in the README.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted">
        <h2 className="mb-1 text-sm font-semibold text-white">About this tracker</h2>
        <p>
          Data is stored only on this device (IndexedDB). Nothing is sent anywhere. Clearing your
          browser's site data for this app will erase your history.
        </p>
      </section>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-surface2'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
