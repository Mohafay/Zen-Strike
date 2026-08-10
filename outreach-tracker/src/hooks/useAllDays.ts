import { useCallback, useEffect, useState } from 'react';
import { getAllDays, putDay } from '../lib/db';
import type { DayRecord } from '../types';

export function useAllDays() {
  const [days, setDays] = useState<Map<string, DayRecord>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getAllDays();
      if (cancelled) return;
      setDays(new Map(list.map((d) => [d.date, d])));
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upsert = useCallback((record: DayRecord) => {
    setDays((prev) => {
      const next = new Map(prev);
      next.set(record.date, record);
      return next;
    });
    void putDay(record);
  }, []);

  return { days, loaded, upsert };
}
