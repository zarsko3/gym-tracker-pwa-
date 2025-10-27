import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface QueuedWorkout {
  id: string;
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
      completed?: boolean;
    }>;
  }>;
  timestamp: number;
  userId: string;
}

const QUEUE_KEY = 'workout-queue';

export const queueWorkoutSave = (workout: Omit<QueuedWorkout, 'id' | 'timestamp'>): void => {
  try {
    const queue = getQueue();
    const queuedWorkout: QueuedWorkout = {
      ...workout,
      id: `${workout.userId}-${workout.date}-${Date.now()}`,
      timestamp: Date.now()
    };
    
    queue.push(queuedWorkout);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    
    console.log('Workout queued for offline sync:', queuedWorkout.id);
  } catch (error) {
    console.error('Error queuing workout:', error);
  }
};

export const getQueue = (): QueuedWorkout[] => {
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error reading workout queue:', error);
    return [];
  }
};

export const clearQueue = (): void => {
  try {
    localStorage.removeItem(QUEUE_KEY);
    console.log('Workout queue cleared');
  } catch (error) {
    console.error('Error clearing workout queue:', error);
  }
};

export const syncQueue = async (userId: string): Promise<{ success: number; failed: number }> => {
  const queue = getQueue();
  const userQueue = queue.filter(workout => workout.userId === userId);
  
  if (userQueue.length === 0) {
    return { success: 0, failed: 0 };
  }

  let success = 0;
  let failed = 0;
  const failedWorkouts: QueuedWorkout[] = [];

  console.log(`Syncing ${userQueue.length} queued workouts...`);

  for (const workout of userQueue) {
    try {
      const workoutRef = doc(db, 'users', workout.userId, 'workouts', workout.date);
      await setDoc(workoutRef, {
        date: workout.date,
        workoutType: workout.workoutType,
        templateId: workout.templateId,
        exercises: workout.exercises
      });
      
      success++;
      console.log(`Synced workout: ${workout.id}`);
    } catch (error) {
      console.error(`Failed to sync workout ${workout.id}:`, error);
      failed++;
      failedWorkouts.push(workout);
    }
  }

  // Update queue with only failed workouts
  const remainingQueue = queue.filter(workout => 
    workout.userId !== userId || failedWorkouts.some(failed => failed.id === workout.id)
  );
  
  if (remainingQueue.length === 0) {
    clearQueue();
  } else {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
  }

  console.log(`Sync complete: ${success} successful, ${failed} failed`);
  return { success, failed };
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const setupOnlineListener = (onOnline: () => void, onOffline: () => void): (() => void) => {
  const handleOnline = () => {
    console.log('Connection restored');
    onOnline();
  };

  const handleOffline = () => {
    console.log('Connection lost');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
