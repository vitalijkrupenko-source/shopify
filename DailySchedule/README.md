# Daily — a premium, simple daily‑schedule app

Daily builds one great day around the life you *want*, then quietly keeps you on
it — every day. It's not a to‑do list and not a full calendar. It's the answer to
one question: **"what am I doing right now, and what's next?"**

<p align="center"><img src="App/Resources/Assets.xcassets/AppIcon.appiconset/icon-1024.png" width="160" alt="Daily icon"></p>

## The idea

- **Onboarding asks who you want to be, not what to do.** You pick goals
  ("Look good", "Eat well", "Time for family") and tell Daily your two fixed
  points (wake / sleep) and your work hours. Daily *generates* a full, clean,
  non‑overlapping day from that — training, cooking, meals, focus, family time —
  and repeats it every day.
- **One button: the mic.** To add anything else you just speak:
  *"Add training on Wednesday from 7 to 9pm."* It's parsed **on‑device** into a
  block — no accounts, no server, no API keys.
- **Calm status, never nagging.** Instead of alerts, Daily shows a quiet
  **Live Activity** on the lock screen and Dynamic Island — *"You're training"*,
  *"In 45m: shopping"* — plus one **passive** heads‑up before each block.
- **Widgets** for the home screen and lock screen show your current + next task.

## What's in here

```
DailySchedule/
├─ project.yml               # XcodeGen project definition (app + widget)
├─ Shared/                   # Compiled into BOTH the app and the widget
│  ├─ ScheduleModels.swift   #   Category, ScheduleBlock, ScheduleData, Clock
│  ├─ ScheduleEngine.swift   #   "what's now / next" — the single source of truth
│  ├─ SharedStore.swift      #   one JSON file in the App Group container
│  ├─ LiveActivityAttributes.swift
│  └─ Theme.swift            #   design tokens
├─ App/
│  ├─ DailyApp.swift
│  ├─ Models/                #   ScheduleStore, DayBuilder (goals → schedule)
│  ├─ Voice/                 #   SpeechRecognizer + on-device CommandParser
│  ├─ System/                #   NotificationScheduler, LiveActivityManager
│  ├─ Views/                 #   Onboarding, Today, timeline, voice sheet
│  └─ Resources/             #   Info.plist, entitlements, Assets (icon)
└─ Widget/                   #   Home + lock-screen widgets, Live Activity UI
```

## Build & run

You need a Mac with **Xcode 15+** (targets iOS 17). The project is generated
with [XcodeGen](https://github.com/yonpols/XcodeGen) so the repo stays clean and
diff‑friendly.

```bash
# 1. Install XcodeGen (once)
brew install xcodegen

# 2. Generate the Xcode project
cd DailySchedule
xcodegen generate

# 3. Open it
open Daily.xcodeproj
```

Then in Xcode:

1. Select the **Daily** target → *Signing & Capabilities* → pick your Team.
   Do the same for the **DailyWidget** target. (Or set `DEVELOPMENT_TEAM` in
   `project.yml` and re‑run `xcodegen generate`.)
2. Both targets already declare the **App Group** `group.com.daily.schedule` and
   the app declares **Live Activities** — no manual capability setup needed.
3. Run on a device or simulator.

> No XcodeGen? You can instead create a new iOS App project in Xcode, drag in the
> `Shared`, `App`, and `Widget` folders, add a Widget Extension target, and set
> the App Group on both targets. `project.yml` documents exactly which files and
> settings each target needs.

## Try it in 30 seconds

1. Launch → answer the short setup (wake/sleep, work, pick a couple of goals) →
   **Build my day**. You land on a full, generated schedule.
2. Tap the **mic** and say *"dinner with mum on Friday at 7pm"* — confirm the
   card it shows you.
3. Long‑press the home screen → add the **Daily** widget. On the lock screen,
   add the circular / rectangular widgets.
4. While a block is active, check the **Dynamic Island / lock screen** for the
   live status.

## Design notes

- **Everything routes through `ScheduleEngine`** so the app, the widgets, the
  notifications, and the Live Activity can never disagree about your day.
- **Persistence is one small JSON file** in the shared App Group container —
  no database, no network. That's the whole backend.
- **Voice parsing is regex‑based and local.** It understands day names,
  `today` / `tomorrow` / `everyday`, `from X to Y`, and `at X for N hours`, and
  guesses a category from keywords.
- Kept intentionally small: onboarding, a day view, a voice sheet, a tiny
  settings sheet. No feeds, no social, no accounts.
