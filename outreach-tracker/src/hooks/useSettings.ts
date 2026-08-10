import { useCallback, useEffect, useState } from 'react';
import { getSettings, putSettings } from '../lib/db';
import { DEFAULT_SETTINGS } from '../lib/dailyTemplate';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getSettings();
      if (!cancelled) {
        setSettings(s);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void putSettings(next);
      return next;
    });
  }, []);

  return { settings, loaded, update };
}
