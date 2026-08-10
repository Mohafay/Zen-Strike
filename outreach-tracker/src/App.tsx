import { useMemo, useState } from 'react';
import { useToday } from './hooks/useToday';
import { useAllDays } from './hooks/useAllDays';
import { useDayActions } from './hooks/useDayActions';
import { useSettings } from './hooks/useSettings';
import { useReminder } from './hooks/useReminder';
import { computeStreak } from './lib/streak';
import { TodayView } from './components/TodayView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { NavTabs, type Tab } from './components/NavTabs';
import { NotificationBanner } from './components/NotificationBanner';

export default function App() {
  const today = useToday();
  const { days, loaded, upsert } = useAllDays();
  const { settings, update: updateSettings } = useSettings();
  const [tab, setTab] = useState<Tab>('today');

  const actions = useDayActions(today, days, upsert);
  const streak = useMemo(() => computeStreak(days, today), [days, today]);

  useReminder(actions.record, settings, actions.markReminderFired);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <NotificationBanner onEnabled={() => updateSettings({ notificationsEnabled: true })} />

      <main className="mx-auto max-w-md">
        {tab === 'today' && <TodayView date={today} streak={streak} actions={actions} />}
        {tab === 'history' && <HistoryView days={days} />}
        {tab === 'settings' && <SettingsView settings={settings} onUpdate={updateSettings} />}
      </main>

      <NavTabs active={tab} onChange={setTab} />
    </div>
  );
}
