# Outreach Tracker

A personal, installable web app for one job: show today's fixed outreach
checklist, let you tick/count things off, remember every day in local
history, and give you a nudge at day's end about whatever's still undone.

No login, no backend, no analytics. Everything lives in your browser's
IndexedDB, on your device only.

**Scope: desktop Chrome only.** This is built and tested for Chrome on a
laptop/desktop — no mobile install flow, no iOS/Safari support. See
[Platform scope](#platform-scope) below.

## Stack

Vite + React + TypeScript + Tailwind, packaged as a PWA (installable in
Chrome, offline-capable) with `vite-plugin-pwa`. Local storage via `idb`
(IndexedDB). That's the whole dependency list beyond React itself.

## Run it

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL in Chrome.

To build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Install as a desktop app (optional)

Serve the `dist/` build over HTTPS (or just use `localhost`) and, in
Chrome, click the install icon in the address bar (or the **⋮** menu →
"Install Outreach Tracker"). It then opens in its own window without tabs
or an address bar, and works offline since the app shell is precached by
the service worker — your data was always local anyway. Plain
`npm run dev`/`preview` on `localhost` is enough for this; you don't need
real hosting unless you want the installed app to survive `npm run dev`
not running.

## The daily checklist

Hardcoded in `src/lib/dailyTemplate.ts`. Edit that file if you want to
change wording or targets — there's intentionally no in-app settings UI for
the checklist itself, since it's meant to be a fixed, non-negotiable daily
floor rather than something to fiddle with.

- **Outreach floor** (mandatory):
  - LinkedIn connection requests — counter, target 20/day.
  - Personalized emails sent — counter, **ramping target**: 10/day in your
    first week using the app, 20/day in week 2, 34/day from week 3 on. The
    "week" clock starts the first day you open the app (`Settings.startDate`,
    locked in automatically on first launch) and advances in 7-day blocks —
    see `emailsTarget()` in `dailyTemplate.ts`.
  - Upwork applications — counter, target 3/day (no number was given for
    this one, so it's a placeholder; edit freely).
  - Caught up on follow-ups — plain checkbox, not a counter, since the
    actual number of follow-ups varies day to day. Just tick it once
    you're caught up.
- **Daily wins** (checkboxes, not mandatory for the streak): booked 1
  call, posted 1 piece of content.
- **End-of-day log** (plain number, not a checkbox): total touches. This
  section is deliberately just the one input-side number — no
  replies/calls-booked/deals-closed output metrics are tracked.

**Long-press** any *counter* row (not the checkboxes) to force it
done/undone regardless of the number — useful if you did the work
somewhere the counter doesn't capture, or want to correct a mis-tap.

A new calendar day (local time) automatically starts a fresh checklist;
everything before it stays in History. **Saturday is a normal mandatory
day; only Sunday is optional** (shown, trackable, but doesn't count against
you).

## Streak & progress ring

The ring shows "N of 6 done" across the outreach floor (4: 3 counters +
"caught up on follow-ups") + daily wins (2). The streak counts
**consecutive mandatory days** (Mon–Sat) where the full outreach floor was
hit — Sundays don't count and don't break it (they're just skipped), and
today gets a pass while still in progress rather than counting against you
mid-day. See `src/lib/streak.ts` for the exact logic.

## Timer / time blocking

The Timer tab lets you block out a chunk of time for one activity — e.g.
"2h for cold emails" — and count it down. Pick (or type) a label, pick a
duration (25m/50m/1h/2h presets or type custom minutes), hit Start. You can
pause/resume, and "Stop & save" logs the actual elapsed time against
today, visible in the "Today's blocks" list below and rolled up into the
weekly "Time logged" stat in History. "Discard without saving" throws it
away instead.

The countdown is computed from wall-clock timestamps (not a running JS
loop), so it keeps correct time across reloads or the tab being
backgrounded. If notifications are enabled, hitting the planned duration
fires one "time block done" notification.

## History

The History tab has a calendar heatmap (green = outreach floor hit that
day, amber = you logged something but didn't hit the floor, dark = no
data, Sundays dimmed since they're optional), a weekly summary card
(touches, time logged, and floor-hit days for the current Mon–today
window — inputs only, no output/result metrics), and a scrollable list of
the last 14 days' numbers.

## Background image

The app's background is a fixed, full-viewport photo behind a dark scrim,
with every card rendered as frosted glass (translucent + blurred) so the
photo reads through. Drop your image at `public/bg.jpg` (any landscape
photo works; something in the 1600–2400px-wide range is plenty) — it's
referenced by that fixed path in `src/App.tsx`. Until you add it, the app
just shows the dark scrim on its own.

## Reminders

Optional and non-blocking — the app never stops you from doing anything
because of a reminder. On first load you'll see a small banner asking to
enable notifications; you can also turn this on/off and change the time
(default 18:00) any time from Settings.

At your reminder time, if anything in the outreach floor or daily wins is
still undone, you'll get a Chrome notification listing exactly what's
left, e.g. "Still to do: 6 LinkedIn requests, 12 emails, caught up on
follow-ups." Fires once per day.

**Reliability note:** there's no backend or push service here — the check
runs from JavaScript inside the app, so Chrome (this tab, or the installed
app window) needs to be running on your laptop around your reminder time.
If Chrome is fully closed, nothing fires until you next open it.

## Platform scope

This is built for **Chrome on desktop only** — that's the only
configuration it's tested against, and mobile-specific install hooks
(the iOS/Android "Add to Home Screen" meta tags, maskable/Apple-touch
icons) have been deliberately left out of `index.html` and the manifest.
Note that this isn't a hard technical lock: nothing stops you from opening
the same URL in a mobile browser or a different desktop browser, it just
won't get the install treatment or any layout/notification tuning for
those cases, and isn't something this app tries to support.

## A note on where this lives

This project was added as `outreach-tracker/` inside the existing
`Zen-Strike` repository rather than replacing the repo's existing
(unrelated) marketing site at the root, so both projects coexist without
stepping on each other. It's fully self-contained — its own
`package.json`, `node_modules`, etc. — so `cd outreach-tracker` and the
commands above are all you need.

## Data & privacy

Everything is stored client-side in IndexedDB (database `outreach-tracker`).
Nothing is sent to any server. Clearing your browser's site data (or
uninstalling the installed app) erases your history — there's no
backup/export built in.
