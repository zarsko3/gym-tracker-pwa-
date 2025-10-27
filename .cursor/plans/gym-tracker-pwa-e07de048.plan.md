<!-- e07de048-2b50-4865-914b-a6dbfb77ad7a ffa4e388-efbd-4829-a7bb-0a059ee6b97d -->
# Workout UX Improvements - Inline Panel & Timer System

## Overview

Transform the gym tracker into a fast, gym-floor-ready app by:

- Adding inline day expansion for quick workout access
- Implementing automatic workout and rest timers
- Pre-filling inputs from previous sessions with quick adjustment buttons
- Adding auto-save functionality and dark mode optimizations

## Implementation Strategy

### 1. Inline Calendar Day Expansion

**File: `src/features/calendar/Calendar.tsx`**

Replace the `Link` wrapper with a clickable div that expands inline:

```typescript
const [expandedDate, setExpandedDate] = useState<string | null>(null);

// In the calendar grid render:
<div key={dateString}>
  <div
    onClick={() => setExpandedDate(expandedDate === dateString ? null : dateString)}
    className={`calendar-day ${isToday(dayDate) ? 'today' : ''} ${expandedDate === dateString ? 'selected' : ''}`}
  >
    {/* Existing day content */}
  </div>
  
  {expandedDate === dateString && (
    <InlineWorkoutPanel 
      date={dateString}
      existingWorkout={workouts[dateString]}
      onClose={() => setExpandedDate(null)}
    />
  )}
</div>
```

**New Component: `src/features/calendar/InlineWorkoutPanel.tsx`**

Create a collapsible panel that shows below the clicked day:

- Workout type selector (Push/Pull/Legs/Rest) at the top
- Full exercise list with quick-log inputs
- Start Workout button that activates timer mode
- Compact design that fits within the calendar view
- Slide-down animation using Tailwind transitions

### 2. Workout Timer System

**New Hook: `src/hooks/useWorkoutTimer.ts`**

```typescript
export const useWorkoutTimer = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Timer logic with setInterval
    // Persist to localStorage for recovery
  }, [isActive]);

  return {
    elapsed,
    isActive,
    start: () => { setStartTime(Date.now()); setIsActive(true); },
    pause: () => setIsActive(false),
    stop: () => { setIsActive(false); setElapsed(0); setStartTime(null); },
    formattedTime: formatDuration(elapsed)
  };
};
```

**New Hook: `src/hooks/useRestTimer.ts`**

```typescript
export const useRestTimer = (defaultRestSeconds = 90) => {
  const [timeRemaining, setTimeRemaining] = useState(defaultRestSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Countdown timer logic
    // Trigger notification/vibration when complete
    if (timeRemaining === 0 && isActive) {
      // Play sound or vibrate
      navigator.vibrate?.(500);
    }
  }, [timeRemaining, isActive]);

  return {
    timeRemaining,
    isActive,
    start: () => { setTimeRemaining(defaultRestSeconds); setIsActive(true); },
    pause: () => setIsActive(false),
    skip: () => { setIsActive(false); setTimeRemaining(0); },
    formattedTime: formatTime(timeRemaining)
  };
};
```

**Integration: Update `InlineWorkoutPanel.tsx` and `ExerciseCard.tsx`**

Add timer UI at the top of the workout panel:

```typescript
const workoutTimer = useWorkoutTimer();

// Start button triggers timer
<button onClick={workoutTimer.start}>
  Start Workout - {workoutTimer.formattedTime}
</button>
```

Add rest timer after each set logged:

```typescript
const restTimer = useRestTimer(90);

// Auto-start after logging a set
const onSetComplete = () => {
  // Save set data
  restTimer.start();
};
```

### 3. Quick Input System with Pre-fill

**Update: `src/features/workout/ExerciseCard.tsx`**

Modify the set input row to include:

```typescript
// Pre-fill logic - already fetches lastWorkoutStats
// Enhance to populate input values:
const [sets, setSets] = useState<Array<{ reps: number; weight: number; completed: boolean }>>(
  // Pre-fill from last workout if available
  lastWorkoutData || exercise.sets
);

// Add increment/decrement buttons
<div className="flex items-center gap-2">
  <button onClick={() => adjustWeight(index, -5)}>-5</button>
  <input value={set.weight} onChange={...} className="text-2xl font-bold" />
  <button onClick={() => adjustWeight(index, +5)}>+5</button>
</div>

<div className="flex items-center gap-2">
  <button onClick={() => adjustReps(index, -1)}>-</button>
  <input value={set.reps} onChange={...} className="text-2xl font-bold" />
  <button onClick={() => adjustReps(index, +1)}>+</button>
</div>

// Checkmark button to mark set complete
<button onClick={() => markSetComplete(index)} className="ml-2">
  {set.completed ? '✓' : '○'}
</button>
```

Style adjustments:

- Larger touch targets (min 48px)
- High contrast buttons for gym lighting
- Bold, large fonts for weight/reps inputs

### 4. Auto-save After Each Set

**Update: `src/features/workout/ExerciseCard.tsx`**

Add debounced auto-save using Firestore:

```typescript
import { debounce } from 'lodash-es'; // or custom debounce

const debouncedSave = useMemo(
  () => debounce((updatedSets) => {
    // Save to Firestore immediately
    const workoutRef = doc(db, 'users', user.uid, 'workouts', workoutDate);
    updateDoc(workoutRef, {
      exercises: arrayUnion({ name: exercise.name, sets: updatedSets })
    });
  }, 1000),
  [user, workoutDate, exercise.name]
);

const updateSet = (index: number, field: string, value: number) => {
  const newSets = [...sets];
  newSets[index] = { ...newSets[index], [field]: value };
  setSets(newSets);
  onUpdate({ ...exercise, sets: newSets });
  debouncedSave(newSets); // Auto-save
};
```

Add optimistic UI feedback:

- Show "Saving..." indicator
- Checkmark when saved successfully
- Retry logic on failure

### 5. Enhanced Mobile UI

**Update: `src/style.css`**

Add gym-friendly dark mode enhancements:

```css
/* Darker background for gym lighting */
.workout-active {
  background: #0a0a0a;
}

/* High-contrast buttons */
.btn-primary {
  @apply bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg;
  min-height: 56px;
  font-size: 18px;
}

/* Large input fields for gym use */
.workout-input {
  @apply bg-gray-800 text-white text-3xl font-bold text-center rounded-lg p-4;
  min-height: 64px;
  border: 2px solid transparent;
}

.workout-input:focus {
  border-color: #6366f1;
  outline: none;
}

/* Timer display */
.timer-display {
  @apply text-4xl font-mono font-bold text-indigo-400;
}
```

**Add haptic feedback for button taps:**

```typescript
const vibrate = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // Short tactile feedback
  }
};

// On every button press
<button onClick={() => { vibrate(); handleAction(); }}>
```

### 6. Additional Improvements

**File: `src/features/workout/WorkoutSummary.tsx` (new)**

Create a collapsible summary at the top of inline panel:

- Total volume
- Sets completed vs planned
- Workout duration
- Previous workout comparison

**File: `src/utils/workoutCalculations.ts` (new)**

Centralize calculations:

```typescript
export const calculateTotalVolume = (exercises) => { ... };
export const calculate1RM = (weight, reps) => { ... };
export const calculateProgressPercentage = (current, previous) => { ... };
```

**File: `src/features/progress/VolumeChart.tsx` (new)**

Add weekly volume trend chart by muscle group:

- Group exercises by Push/Pull/Legs
- Show volume over last 4-8 weeks
- Highlight trends (increasing/decreasing)

### 7. Offline Mode Enhancement

**Update: `vite.config.ts`**

Enhance service worker caching:

```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firestore-cache',
        networkTimeoutSeconds: 10
      }
    }
  ]
}
```

**Add: `src/services/offlineQueue.ts`**

Queue workout saves when offline:

```typescript
export const queueWorkoutSave = (workout) => {
  const queue = JSON.parse(localStorage.getItem('workout-queue') || '[]');
  queue.push(workout);
  localStorage.setItem('workout-queue', JSON.stringify(queue));
};

export const syncQueue = async () => {
  // Upload queued workouts when online
  // Clear queue after successful sync
};
```

## Testing Checklist

- [ ] Inline panel expands/collapses smoothly on mobile
- [ ] Workout timer persists across page refreshes
- [ ] Rest timer triggers notification when complete
- [ ] Pre-fill correctly loads from last workout
- [ ] +/- buttons work for quick weight adjustments
- [ ] Auto-save writes to Firestore after each set
- [ ] Haptic feedback works on iOS/Android
- [ ] Offline mode queues saves and syncs later
- [ ] Dark mode is optimized for gym lighting
- [ ] All touch targets are minimum 48px

## Files to Modify

1. `src/features/calendar/Calendar.tsx` - Add inline expansion logic
2. `src/features/workout/ExerciseCard.tsx` - Quick inputs, pre-fill, auto-save
3. `src/features/workout/WorkoutLogger.tsx` - Timer integration
4. `src/style.css` - Gym-optimized dark mode styles

## Files to Create

1. `src/features/calendar/InlineWorkoutPanel.tsx` - Inline panel component
2. `src/hooks/useWorkoutTimer.ts` - Overall workout timer
3. `src/hooks/useRestTimer.ts` - Rest period timer
4. `src/features/workout/WorkoutSummary.tsx` - Compact summary view
5. `src/utils/workoutCalculations.ts` - Calculation utilities
6. `src/features/progress/VolumeChart.tsx` - Volume trend chart
7. `src/services/offlineQueue.ts` - Offline sync queue

## Dependencies to Add

```json
{
  "lodash-es": "^4.17.21" // For debounce utility
}
```

### To-dos

- [ ] Implement inline day expansion in Calendar component with collapsible workout panel
- [ ] Create useWorkoutTimer hook with localStorage persistence and pause/resume functionality
- [ ] Create useRestTimer hook with countdown, notifications, and auto-start after set completion
- [ ] Build InlineWorkoutPanel component with workout type selector and full exercise list
- [ ] Add +/- increment buttons and pre-fill logic from previous workout in ExerciseCard
- [ ] Implement debounced auto-save to Firestore after each set with optimistic UI
- [ ] Add checkmark buttons to mark sets as completed with visual indicators
- [ ] Update CSS for larger touch targets, high-contrast buttons, and dark mode optimization
- [ ] Add vibration feedback for button taps on mobile devices
- [ ] Create WorkoutSummary component showing volume, duration, and progress comparison
- [ ] Implement offline queue system for workout saves with background sync
- [ ] Build VolumeChart component for weekly muscle group volume trends