import { useMemo, useState } from 'react';
import { useToday } from './hooks/useToday';
import { useAllDays } from './hooks/useAllDays';
import { useDayActions } from './hooks/useDayActions';
import { useSettings } from './hooks/useSettings';
import { useReminder } from './hooks/useReminder';
import { computeStreak } from './lib/streak';
import { TodayView } from './components/TodayView';
import { TimerView } from './components/TimerView';
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
  const streak = useMemo(
    () => computeStreak(days, today, settings.startDate),
    [days, today, settings.startDate]
  );

  useReminder(actions.record, settings, actions.markReminderFired);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  return (
    // No bg-bg here: this wrapper is a positioning context (position:
    // relative), so an opaque background on it would paint above the
    // fixed, negative-z-index photo layer below and hide it completely.
    // The photo div's own bg-bg is the fallback color instead.
    <div className="relative min-h-screen">
      {/* Fixed (not `background-attachment: fixed`, which iOS Safari breaks)
          full-viewport background photo + dark scrim. Drop your image at
          public/bg.jpg — see README. */}
      <div
        className="fixed inset-0 -z-10 bg-bg bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,15,20,0.55) 0%, rgba(11,15,20,0.8) 65%, rgba(11,15,20,0.95) 100%), url('/bg.jpg')"
        }}
      />

      <NotificationBanner onEnabled={() => updateSettings({ notificationsEnabled: true })} />

      <main className="mx-auto max-w-2xl">
        {tab === 'today' && (
          <TodayView date={today} streak={streak} startDate={settings.startDate} actions={actions} />
        )}
        {tab === 'timer' && (
          <TimerView
            record={actions.record}
            notificationsEnabled={settings.notificationsEnabled}
            onSaveBlock={actions.addTimeBlock}
          />
        )}
        {tab === 'history' && <HistoryView days={days} startDate={settings.startDate} />}
        {tab === 'settings' && <SettingsView settings={settings} onUpdate={updateSettings} />}
      </main>

      <NavTabs active={tab} onChange={setTab} />
    </div>
  );
}
