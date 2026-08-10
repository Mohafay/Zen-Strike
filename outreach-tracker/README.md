# Outreach Tracker

A personal, installable PWA for one job: show today's fixed outreach checklist,
let you tick/count things off, remember every day in local history, and give
you a nudge at day's end about whatever's still undone.

No login, no backend, no analytics. Everything lives in your browser's
IndexedDB, on your device only.

## Stack

Vite + React + TypeScript + Tailwind, packaged as a PWA (installable,
offline-capable) with `vite-plugin-pwa`. Local storage via `idb`
(IndexedDB). That's the whole dependency list beyond React itself.

## Run it

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. On the same Wi-Fi, your phone
can also hit `http://<your-computer's-LAN-IP>:5173` (Vite prints this too as
"Network:") if you want to try it on your phone before installing.

To build a production bundle (used when you install it on your phone, see
below):

```bash
npm run build
npm run preview   # serves the production build locally, for a final check
```

## Install on your phone

The app needs to be served over **HTTPS** (or `localhost`) for install +
notifications to work — plain `http://<lan-ip>` on your phone will load the
app but the browser won't offer to install it or grant notification
permission. Easiest path: deploy the `dist/` folder (after `npm run build`)
to any static host you like (Netlify, Vercel, GitHub Pages, Cloudflare
Pages...) and open that HTTPS URL on your phone. There's no server-side
code, so any static host works.

**Android (Chrome):**
1. Open the app's HTTPS URL in Chrome.
2. Tap the **⋮** menu → **Add to Home screen** (or wait for Chrome's own
   install prompt banner).
3. Confirm. It now launches full-screen from your home screen like a native
   app.

**iPhone (Safari):**
1. Open the app's HTTPS URL in Safari (must be Safari, not Chrome-on-iOS).
2. Tap the **Share** icon → **Add to Home Screen**.
3. Confirm. It launches full-screen, no browser chrome.

**Desktop (Chrome/Edge):** click the install icon in the address bar, or
the browser's menu → "Install Outreach Tracker".

Once installed, it works fully offline (the app shell is precached by the
service worker) — your data was always local anyway.

## The daily checklist

Hardcoded in `src/lib/dailyTemplate.ts`. Edit that file if you want to
change wording or targets — there's intentionally no in-app settings UI for
the checklist itself, since it's meant to be a fixed, non-negotiable daily
floor rather than something to fiddle with.

- **Outreach floor** (counters, tap +/− toward a target, auto-marks done at
  target): LinkedIn requests (20), personalized emails (34), follow-ups
  (20), Upwork applications (3 — no target was given for this one, so it's
  a placeholder; edit it in `dailyTemplate.ts`).
- **Daily wins** (checkboxes): booked 1 call, posted 1 piece of content.
- **End-of-day log** (plain numbers, not checkboxes): total touches. This
  section is deliberately just the one input-side number — no
  replies/calls-booked/deals-closed output metrics are tracked.

**Long-press** any outreach-floor row to force it done/undone regardless of
the counter — useful if you did the work somewhere the counter doesn't
capture, or want to correct a mis-tap.

A new calendar day (local time) automatically starts a fresh checklist;
everything before it stays in History. **Saturday is a normal mandatory
day; only Sunday is optional** (shown, trackable, but doesn't count against
you).

## Streak & progress ring

The ring shows "N of 6 done" across the outreach floor (4) + daily wins (2).
The streak counts **consecutive mandatory days** (Mon–Sat) where the full
outreach floor was hit — Sundays don't count and don't break it (they're
just skipped), and today gets a pass while still in progress rather than
counting against you mid-day. See `src/lib/streak.ts` for the exact logic.

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
backgrounded — same reasoning as the reminder check below. If notifications
are enabled, hitting the planned duration fires one "time block done"
notification (same reliability caveats as the end-of-day reminder).

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
just shows the dark scrim on its own, which is why it currently looks
identical to before.

## Reminders

Optional and non-blocking — the app never stops you from doing anything
because of a reminder. On first load you'll see a small banner asking to
enable notifications; you can also turn this on/off and change the time
(default 18:00) any time from Settings.

At your reminder time, if anything in the outreach floor or daily wins is
still undone, you'll get a browser notification listing exactly what's
left, e.g. "Still to do: 6 LinkedIn requests, 12 emails, post content."
Fires once per day per device.

**Reliability note:** there's no backend or push service here — the
reminder check runs from JavaScript inside the app (via the service
worker's `showNotification`), so it only fires while the app is open, or
was recently open in the background.

- **Android / desktop:** reliable once installed as a PWA, as long as you
  open it at least occasionally around your reminder time — Chrome keeps
  installed PWAs' service workers alive reasonably well.
- **iOS:** Safari and installed PWAs get suspended aggressively in the
  background, so a reminder may only actually show once you open the app,
  even if "past" your reminder time. Treat it as "check when you next open
  it," not a guaranteed push.

### OPTIONAL: guaranteed phone reminders via Telegram (not built)

If iOS's background limits bother you and you want a reminder that arrives
regardless of whether the app is open, the standard workaround is a tiny
Telegram bot, since Telegram delivers real push notifications outside the
browser entirely. This is **not implemented** — flagging the idea only,
build it later if you want it:

1. Create a bot via [@BotFather](https://t.me/BotFather), get a bot token.
2. Message the bot once so it can find your chat ID (e.g. via
   `https://api.telegram.org/bot<token>/getUpdates`).
3. Add a small serverless function (Cloudflare Worker / Vercel cron /
   GitHub Actions on a schedule) that, once a day at your reminder time,
   checks whatever you've logged and calls Telegram's
   `sendMessage` API with what's left.
4. That function would need read access to your data — since everything
   currently lives only in this device's IndexedDB with no backend, this
   is the one piece that would require either syncing your data somewhere
   (e.g. a tiny cloud KV store) or replicating the "what's left" logic
   server-side against data you push to it.

This crosses from "purely local app" into "needs a small backend," which is
why it's out of scope unless you actually want to build it.

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
uninstalling the PWA, on some platforms) erases your history — there's no
backup/export built in.
