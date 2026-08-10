// All dates are local-time "YYYY-MM-DD" strings, never UTC-shifted, so the
// checklist rolls over at local midnight regardless of the user's timezone.

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

export function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, delta: number): string {
  const d = parseDateStr(s);
  d.setDate(d.getDate() + delta);
  return toDateStr(d);
}

export function daysBetween(fromInclusive: string, toInclusive: string): number {
  const ms = parseDateStr(toInclusive).getTime() - parseDateStr(fromInclusive).getTime();
  return Math.round(ms / 86_400_000);
}

// Only Sunday is optional — Saturday is a normal mandatory day.
export function isOptionalDay(s: string): boolean {
  return parseDateStr(s).getDay() === 0;
}

export function weekdayLabel(s: string): string {
  return parseDateStr(s).toLocaleDateString(undefined, { weekday: 'short' });
}

export function friendlyDate(s: string): string {
  return parseDateStr(s).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

// Monday-start week key for a given date, as the Monday's date string.
export function weekStart(s: string): string {
  const d = parseDateStr(s);
  const dow = d.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diffToMonday);
  return toDateStr(d);
}

export function daysInRange(startInclusive: string, endInclusive: string): string[] {
  const out: string[] = [];
  let cur = startInclusive;
  while (cur <= endInclusive) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

// Monday-start 6x7 grid of date strings (with null padding) covering the
// given month, for a calendar heatmap layout.
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  const firstDow = first.getDay(); // 0 Sun .. 6 Sat
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toDateStr(new Date(year, month, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
