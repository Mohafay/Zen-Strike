import { useCallback, useEffect, useState } from 'react';
import { clearActiveTimer, elapsedSeconds, loadActiveTimer, saveActiveTimer } from '../lib/timerStore';
import type { ActiveTimer, TimeBlockEntry } from '../types';

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useActiveTimer(notificationsEnabled: boolean) {
  const [timer, setTimer] = useState<ActiveTimer | null>(() => loadActiveTimer());
  const [, forceTick] = useState(0);

  // Re-render once a second while a timer is running so the countdown moves.
  useEffect(() => {
    if (!timer?.running) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [timer?.running]);

  // Fire a "time block done" notification once, when the planned duration elapses.
  useEffect(() => {
    if (!timer || !timer.running || timer.notifiedComplete) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    if (!notificationsEnabled || !('serviceWorker' in navigator)) return;

    const elapsed = elapsedSeconds(timer);
    if (elapsed < timer.plannedSeconds) return;

    const next = { ...timer, notifiedComplete: true };
    saveActiveTimer(next);
    setTimer(next);

    void navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage({
        type: 'SHOW_REMINDER',
        title: 'Time block done',
        body: `"${timer.label}" just hit its planned time.`,
        tag: `timer-${timer.id}`
      });
    });
  }, [timer, notificationsEnabled]);

  const start = useCallback((label: string, plannedSeconds: number) => {
    const next: ActiveTimer = {
      id: uid(),
      label,
      plannedSeconds,
      startedAt: Date.now(),
      accumulatedSeconds: 0,
      running: true,
      notifiedComplete: false
    };
    saveActiveTimer(next);
    setTimer(next);
  }, []);

  const pause = useCallback(() => {
    setTimer((prev) => {
      if (!prev || !prev.running) return prev;
      const next: ActiveTimer = {
        ...prev,
        accumulatedSeconds: elapsedSeconds(prev),
        running: false
      };
      saveActiveTimer(next);
      return next;
    });
  }, []);

  const resume = useCallback(() => {
    setTimer((prev) => {
      if (!prev || prev.running) return prev;
      const next: ActiveTimer = { ...prev, startedAt: Date.now(), running: true };
      saveActiveTimer(next);
      return next;
    });
  }, []);

  const cancel = useCallback(() => {
    clearActiveTimer();
    setTimer(null);
  }, []);

  const finish = useCallback((): TimeBlockEntry | null => {
    if (!timer) return null;
    const totalSeconds = Math.round(elapsedSeconds(timer));
    const entry: TimeBlockEntry = {
      id: timer.id,
      label: timer.label,
      plannedSeconds: timer.plannedSeconds,
      actualSeconds: totalSeconds,
      startedAt: new Date(timer.startedAt - timer.accumulatedSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString()
    };
    clearActiveTimer();
    setTimer(null);
    return entry;
  }, [timer]);

  return {
    timer,
    elapsed: timer ? elapsedSeconds(timer) : 0,
    remaining: timer ? Math.max(0, timer.plannedSeconds - elapsedSeconds(timer)) : 0,
    start,
    pause,
    resume,
    cancel,
    finish
  };
}
