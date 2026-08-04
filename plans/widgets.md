# ExcuseLess Widgets — Implementation Plan (v0.2)

## Cross-platform data sharing

Widgets run in a separate process. Data is shared via a persisted JSON file:

| Platform | Path |
|---|---|
| **iOS** | `group.com.codewithkin.excuseless/widget-data.json` (via `widgetsDirectory`) |
| **Android** | `FileSystem.documentDirectory/widget-data.json` |

**Shared data schema (`widget-data.json`):**

```json
{
  "nextTask": { "title": "Write docs", "durationMin": 25, "goalTitle": "Project X" },
  "session": {
    "active": false,
    "paused": false,
    "taskTitle": "",
    "remaining": 0,
    "total": 0
  },
  "todayStats": { "completed": 3, "skipped": 1, "focusSeconds": 5400, "totalPending": 5 },
  "streak": 7,
  "updatedAt": "2026-08-04T15:30:00Z"
}
```

A `syncWidgetData()` function writes this from the store after every task mutation. Platform-specific widget update calls follow.

---

## Custom fonts

Widgets use the same font family as the app. Files already in `apps/native/assets/fonts/`.

**iOS (`@expo/ui/swift-ui` `font` modifier):**

```tsx
// HankenGrotesk for body text
<Text modifiers={[font({ name: 'HankenGrotesk', size: 14 })]} />
// HankenGrotesk-Medium for labels
<Text modifiers={[font({ name: 'HankenGrotesk-Medium', size: 12 })]} />
// HankenGrotesk-Bold for titles
<Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 16 })]} />
// JetBrainsMono-Medium for timer/duration numbers
<Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 20 })]} />
```

**Android (`react-native-android-widget` config plugin):**

```json
{
  "fonts": [
    "./assets/fonts/HankenGrotesk-Regular.ttf",
    "./assets/fonts/HankenGrotesk-Medium.ttf",
    "./assets/fonts/HankenGrotesk-Bold.ttf",
    "./assets/fonts/JetBrainsMono-Medium.ttf"
  ]
}
```

`TextWidget` references fonts by filename stem:

```tsx
<TextWidget text="Next task" style={{ fontSize: 12, fontFamily: 'JetBrainsMono-Medium', color: '#8A8A94' }} />
```

---

## Widget 1: Next Task (systemSmall / small)

**Two display modes based on session state:**

| Session state | Shows |
|---|---|
| Inactive | Next pending task title + duration |
| Active, not paused | Current task title + `formatClock(remaining)` + "Focusing" badge |
| Active, paused | Current task title + "Paused" badge |
| No tasks | "All done! 🎉" |

**iOS (`widgets/NextTaskWidget.tsx`):**

```tsx
import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

type Props = {
  title: string;
  durationMin?: number;
  goalTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  remaining?: number;
};

const NextTaskWidget = (props: Props) => {
  'widget';
  return (
    <VStack>
      <Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 11 }), foregroundStyle('#8A8A94')]}>
        {props.sessionActive ? (props.sessionPaused ? 'Paused' : 'Focusing') : 'Next task'}
      </Text>
      <Text
        modifiers={[
          font({ name: 'HankenGrotesk-Bold', size: 15 }),
          foregroundStyle(props.sessionActive ? '#34D399' : '#ECEAE6'),
        ]}
      >
        {props.title}
      </Text>
      <HStack>
        {props.sessionActive && props.remaining !== undefined ? (
          <Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 13 }), foregroundStyle('#34D399')]}>
            {formatClock(props.remaining)}
          </Text>
        ) : props.durationMin ? (
          <Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 12 }), foregroundStyle('#34D399')]}>
            {props.durationMin}m
          </Text>
        ) : null}
        {props.goalTitle ? (
          <Text modifiers={[font({ name: 'HankenGrotesk', size: 11 }), foregroundStyle('#8A8A94')]}>
            · {props.goalTitle}
          </Text>
        ) : null}
      </HStack>
    </VStack>
  );
};

export default createWidget('NextTaskWidget', NextTaskWidget);
```

**Android:** Same conditional logic using `FlexWidget` + `TextWidget`.

**Tap behavior:** Opens app to focus screen.

**Updates:** After complete/skip, session start/end, pause/resume, add/remove/reorder, app foreground.

---

## Widget 2: Today's Progress (systemMedium / medium)

**Unchanged by session state — always shows daily stats.**

3-column layout: tasks done, streak, focus time.

**iOS (`widgets/TodayProgressWidget.tsx`):**

```tsx
import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

type Props = {
  completed: number; totalPending: number; streak: number; focusSeconds: number;
};

const TodayProgressWidget = (props: Props) => {
  'widget';
  const total = props.completed + props.totalPending;
  return (
    <VStack>
      <Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 11 }), foregroundStyle('#8A8A94')]}>
        Today
      </Text>
      <HStack>
        <VStack>
          <Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 20 }), foregroundStyle('#34D399')]}>
            {props.completed}
          </Text>
          <Text modifiers={[font({ name: 'HankenGrotesk', size: 11 }), foregroundStyle('#8A8A94')]}>
            of {total} done
          </Text>
        </VStack>
        <VStack>
          <Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 20 }), foregroundStyle('#ECEAE6')]}>
            {props.streak}
          </Text>
          <Text modifiers={[font({ name: 'HankenGrotesk', size: 11 }), foregroundStyle('#8A8A94')]}>
            day streak
          </Text>
        </VStack>
        <VStack>
          <Text modifiers={[font({ name: 'JetBrainsMono-Medium', size: 16 }), foregroundStyle('#ECEAE6')]}>
            {formatDurationShort(props.focusSeconds)}
          </Text>
          <Text modifiers={[font({ name: 'HankenGrotesk', size: 11 }), foregroundStyle('#8A8A94')]}>
            focused
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};
```

**Android:** Same layout using `FlexWidget` row + `TextWidget` columns.

**Updates:** After complete/skip, session end, streak change.

---

## Widget 3: Quick Start (systemSmall / small)

**Two display modes:**

| Session state | Shows |
|---|---|
| Inactive, has tasks | "Tap to start" + next task title |
| Inactive, no tasks | "No tasks — tap to add one" |
| Active, not paused | "Tap to resume" + current task title |
| Active, paused | "Tap to resume" + "Paused" indicator |

**iOS (`widgets/QuickStartWidget.tsx`):**

```tsx
import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';

type Props = {
  hasTasks: boolean;
  nextTaskTitle?: string;
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionTaskTitle?: string;
};

const QuickStartWidget = (props: Props) => {
  'widget';
  return (
    <VStack>
      {props.sessionActive ? (
        <>
          <Text modifiers={[font({ name: 'HankenGrotesk-Medium', size: 13 }), foregroundStyle('#34D399')]}>
            Tap to resume
          </Text>
          <Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 14 }), foregroundStyle(props.sessionPaused ? '#8A8A94' : '#ECEAE6')]}>
            {props.sessionPaused ? 'Paused · ' : ''}{props.sessionTaskTitle}
          </Text>
        </>
      ) : props.hasTasks ? (
        <>
          <Text modifiers={[font({ name: 'HankenGrotesk-Medium', size: 13 }), foregroundStyle('#34D399')]}>
            Tap to start
          </Text>
          <Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 14 }), foregroundStyle('#ECEAE6')]}>
            {props.nextTaskTitle}
          </Text>
        </>
      ) : (
        <Text modifiers={[font({ name: 'HankenGrotesk', size: 13 }), foregroundStyle('#8A8A94')]}>
          No tasks — tap to add one
        </Text>
      )}
    </VStack>
  );
};
```

**Android:** Same conditional logic with `FlexWidget` + `TextWidget`.

**Tap behavior:** `clickAction="OPEN_APP"` — opens app to focus screen. If session is active, resumes it. If not, starts the next pending task.

---

## Widget 4: Live Activity — Focus Timer (Dynamic Island + Lock Screen)

**iOS only — `activities/FocusTimerActivity.tsx`:**

Shows timer info only during an active session.

```tsx
import { HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity } from 'expo-widgets';

type Props = {
  taskTitle: string; goalTitle?: string;
  remaining: number; total: number;
  paused: boolean;
};

const FocusTimerActivity = (props: Props) => {
  'widget';
  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ name: 'HankenGrotesk-Bold' }), foregroundStyle('#34D399')]}>
          {props.taskTitle}
        </Text>
        <Text modifiers={[font({ name: 'JetBrainsMono-Medium' })]}>
          {formatClock(props.remaining)} · {props.goalTitle ?? 'Focus'}
        </Text>
      </VStack>
    ),
    compactLeading: <Image systemName="timer" color="#34D399" />,
    compactTrailing: (
      <Text modifiers={[font({ name: 'JetBrainsMono-Medium' }), foregroundStyle('#34D399')]}>
        {formatClock(props.remaining)}
      </Text>
    ),
    minimal: <Image systemName="timer" color="#34D399" />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Image systemName="timer" color="#34D399" />
        <Text modifiers={[font({ name: 'HankenGrotesk', size: 12 })]}>Focus</Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ name: 'HankenGrotesk-Bold', size: 20 }), foregroundStyle('#34D399')]}>
          {formatClock(props.remaining)}
        </Text>
        <Text modifiers={[font({ name: 'HankenGrotesk', size: 12 })]}>remaining</Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ name: 'HankenGrotesk' })]}>{props.taskTitle}</Text>
      </VStack>
    ),
  };
};

export default createLiveActivity('FocusTimerActivity', FocusTimerActivity);
```

**Lock Screen circular accessory:** register a second kind `FocusTimerLockScreen` with `accessoryCircular` family. Renders a simple circular ring + remaining time label.

**Start/Update/End in `focus.tsx`:**

```typescript
import FocusTimerActivity from '@/activities/FocusTimerActivity';

// On session start:
const activity = FocusTimerActivity.start({
  taskTitle: currentTask.title, goalTitle: goal?.title,
  remaining: countdown.remaining, total: countdown.total, paused: false,
});

// Every 10s update:
activity?.update({ remaining: countdown.remaining, paused: countdown.paused });

// On session end:
await activity?.end('immediate');
```

---

## Widget 5: Live Activity on Home Screen

The **Next Task widget** serves double duty — during a session, call `updateTimeline()` every 10s for real-time timer display. When the session ends, fall back to `updateSnapshot()` with the next task data.

```typescript
NextTaskWidget.updateTimeline([
  { date: new Date(Date.now() + 10_000), props: sessionData },
]);
```

---

## File structure

```
apps/native/
  widgets/
    NextTaskWidget.tsx          # iOS + Android — session-aware
    TodayProgressWidget.tsx     # iOS + Android — static stats
    QuickStartWidget.tsx        # iOS + Android — session-aware
  activities/
    FocusTimerActivity.tsx      # iOS only — Live Activity
  lib/
    widget-data.ts              # Shared: syncWidgetData(), readWidgetData(), types
  app/
    (tabs)/focus.tsx            # Add Live Activity lifecycle + widget updates
    (tabs)/tasks.tsx            # Add widget updates on task changes
    (tabs)/day.tsx              # Add widget updates on day changes
  app.json                      # expo-widgets + react-native-android-widget plugins
```

---

## Data sync: `lib/widget-data.ts`

Reads persisted state from SecureStore, builds the widget data object, writes to the shared file, then triggers platform-specific widget updates.

```typescript
export async function syncWidgetData() {
  const { loadState } = await import('./storage');
  const state = await loadState();
  const pending = state.tasks.filter(t => t.status === 'pending');
  const session = state.session;

  const data: WidgetData = {
    nextTask: pending[0] ? {
      title: pending[0].title,
      durationMin: pending[0].durationMin,
      goalTitle: state.goals.find(g => g.id === pending[0].goalId)?.title,
    } : null,
    session: session ? {
      active: true,
      paused: !!session.pausedAt,
      taskTitle: state.tasks.find(t => t.id === session.taskId)?.title ?? '',
      remaining: Math.max(0, session.durationSec - computeElapsed(session)),
      total: session.durationSec,
    } : { active: false, paused: false, taskTitle: '', remaining: 0, total: 0 },
    todayStats: computeTodayStats(state.tasks),
    streak: state.stats.streak,
    updatedAt: new Date().toISOString(),
  };

  await writeAndUpdateWidgets(data);
}
```

---

## Update trigger points

| Action | Widget update |
|---|---|
| Session starts | All — NextTask + QuickStart show session state, LiveActivity starts |
| Timer tick (every 10s) | All — NextTask + QuickStart update remaining, LiveActivity updates |
| Session paused/resumed | All — NextTask + QuickStart update badge, LiveActivity updates |
| Session ends | All — NextTask + QuickStart show next task, LiveActivity ends |
| Task completed/skipped | All — refresh data |
| Task added/removed/reordered | NextTask, TodayProgress, QuickStart |
| Streak updated | TodayProgress |
| App foregrounded | All — refresh stale data |

---

## Config plugin registration

**iOS (`app.json` — `expo-widgets`):**

```json
{
  "plugins": [[
    "expo-widgets",
    {
      "groupIdentifier": "group.com.codewithkin.excuseless",
      "widgets": [
        { "name": "NextTaskWidget", "displayName": "Next Task", "description": "Next task or current focus timer", "supportedFamilies": ["systemSmall"] },
        { "name": "TodayProgressWidget", "displayName": "Today's Progress", "description": "Daily stats at a glance", "supportedFamilies": ["systemMedium"] },
        { "name": "QuickStartWidget", "displayName": "Quick Start", "description": "One tap to start your next task", "supportedFamilies": ["systemSmall"] },
        { "name": "FocusTimerLockScreen", "displayName": "Timer", "description": "Live timer on your lock screen", "supportedFamilies": ["accessoryCircular"] }
      ]
    }
  ]]
}
```

**Android (`app.json` — `react-native-android-widget`):**

```json
{
  "plugins": [[
    "react-native-android-widget",
    {
      "fonts": [
        "./assets/fonts/HankenGrotesk-Regular.ttf",
        "./assets/fonts/HankenGrotesk-Medium.ttf",
        "./assets/fonts/HankenGrotesk-Bold.ttf",
        "./assets/fonts/JetBrainsMono-Medium.ttf"
      ],
      "widgets": [
        { "name": "NextTaskWidget", "label": "Next Task", "minWidth": "250dp", "minHeight": "110dp", "targetCellWidth": 4, "targetCellHeight": 2, "description": "Your next task or current focus", "updatePeriodMillis": 1800000 },
        { "name": "TodayProgressWidget", "label": "Today's Progress", "minWidth": "320dp", "minHeight": "120dp", "targetCellWidth": 5, "targetCellHeight": 2, "description": "Today's stats at a glance", "updatePeriodMillis": 1800000 },
        { "name": "QuickStartWidget", "label": "Quick Start", "minWidth": "250dp", "minHeight": "110dp", "targetCellWidth": 4, "targetCellHeight": 2, "description": "One tap to start", "updatePeriodMillis": 1800000 }
      ]
    }
  ]]
}
```

---

## Implementation order (commits)

| # | Description |
|---|---|
| 1 | Install `expo-widgets`, `@expo/ui`, `react-native-android-widget` |
| 2 | Add config plugins to `app.json` for both platforms |
| 3 | Create `lib/widget-data.ts` — data schema, `syncWidgetData()`, `readWidgetData()` |
| 4 | Create `widgets/NextTaskWidget.tsx` — iOS + Android with session-aware display |
| 5 | Wire NextTaskWidget updates into store (focus.tsx, tasks.tsx, day.tsx) |
| 6 | Create `widgets/TodayProgressWidget.tsx` — iOS + Android |
| 7 | Wire TodayProgressWidget updates |
| 8 | Create `widgets/QuickStartWidget.tsx` — iOS + Android with session-aware display |
| 9 | Wire QuickStartWidget updates |
| 10 | Create `activities/FocusTimerActivity.tsx` — iOS Live Activity |
| 11 | Wire Live Activity lifecycle into focus.tsx (start/update/end) |
| 12 | Add `FocusTimerLockScreen` to config + create accessoryCircular widget |
| 13 | `npx expo prebuild --clean` + build + verify |