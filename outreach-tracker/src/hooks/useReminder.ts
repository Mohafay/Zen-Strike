import { useEffect } from 'react';
import { missingItemsSummary } from '../lib/dailyTemplate';
import type { DayRecord, Settings } from '../types';

/**
 * Client-side reminder check. There's no server/push here, so this only
 * fires while the app is open (foreground or a backgrounded installed PWA
 * that the OS hasn't suspended) — see README for platform caveats.
 */
export function useReminder(record: DayRecord, settings: Settings, markFired: () => void) {
  useEffect(() => {
    if (!settings.remindersOn || !settings.notificationsEnabled) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    if (!('serviceWorker' in navigator)) return;
    if (record.reminderFiredAt) return;

    const check = async () => {
      if (record.reminderFiredAt) return;
      const now = new Date();
      const [h, m] = settings.reminderTime.split(':').map(Number);
      const reminderAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
      if (now < reminderAt) return;

      const missing = missingItemsSummary(record, settings.startDate);
      if (missing.length === 0) return;

      try {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: 'SHOW_REMINDER',
          title: 'Still to do today',
          body: `Still to do: ${missing.join(', ')}`,
          tag: `reminder-${record.date}`
        });
        markFired();
      } catch {
        // Service worker unavailable (e.g. dev server without SW support) — skip silently.
      }
    };

    void check();
    const id = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, [record, settings, markFired]);
}
