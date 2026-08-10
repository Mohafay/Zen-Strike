import type { ActiveTimer } from '../types';

const KEY = 'outreach-tracker:active-timer';

// Ephemeral live-timer state lives in localStorage (not IndexedDB) — it's
// recomputed from wall-clock timestamps on every read, so it survives
// reloads and backgrounding without needing a running JS interval.
export function loadActiveTimer(): ActiveTimer | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActiveTimer) : null;
  } catch {
    return null;
  }
}

export function saveActiveTimer(timer: ActiveTimer): void {
  localStorage.setItem(KEY, JSON.stringify(timer));
}

export function clearActiveTimer(): void {
  localStorage.removeItem(KEY);
}

export function elapsedSeconds(timer: ActiveTimer): number {
  const running = timer.running ? (Date.now() - timer.startedAt) / 1000 : 0;
  return timer.accumulatedSeconds + running;
}
