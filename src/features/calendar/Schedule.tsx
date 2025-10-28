import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Plus, CheckCircle } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import ScreenLayout from '../../components/ScreenLayout';

interface WorkoutData {
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
}

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Record<string, WorkoutData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'workouts'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData: Record<string, WorkoutData> = {};
      snapshot.docs.forEach(doc => {
        workoutData[doc.id] = doc.data() as WorkoutData;
      });
      setWorkouts(workoutData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <ScreenLayout contentClassName="flex h-full items-center justify-center">
        <div className="spinner" />
      </ScreenLayout>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long', 
    year: 'numeric' 
  });

  const getWorkoutTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'push': return 'bg-[var(--color-pink)]';
      case 'pull': return 'bg-[var(--color-light-blue)]';
      case 'legs': return 'bg-[var(--color-yellow)]';
      case 'rest': return 'bg-gray-500';
      default: return 'bg-indigo-500';
    }
  };

  const workoutList = Object.entries(workouts)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 10);

  return (
    <ScreenLayout contentClassName="flex h-full flex-col px-6 pt-[86px] pb-10">
      <div className="mb-6">
        <h1 className="text-figma-h1">Schedule</h1>
        <p className="text-figma-caption text-white/60">{dateStr}</p>
      </div>

      <div className="space-y-4">
        {workoutList.map(([date, workout]) => {
          const workoutDate = new Date(date + 'T00:00:00');
          const isCompleted = workout.exercises.every((exercise) =>
            exercise.sets.every((set) => set.completed)
          );

          return (
            <div key={date} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getWorkoutTypeColor(workout.workoutType)}`}>
                    <span className="text-lg font-bold text-[#251B3D]">
                      {workoutDate.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-figma-h3 text-white capitalize">{workout.workoutType}</h3>
                    <p className="text-figma-caption text-white/60">
                      {workoutDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  {isCompleted && <CheckCircle className="h-6 w-6 text-green-400" />}
                  <span className="text-figma-caption">
                    {workout.exercises.length} exercises
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-8 flex h-14 w-14 items-center justify-center self-end rounded-full bg-[var(--color-pink)] shadow-lg">
        <Plus className="h-6 w-6 text-white" />
      </button>

      <BottomNavigation activeTab="schedule" className="mt-auto pt-10" />
    </ScreenLayout>
  );
};

export default Schedule;
