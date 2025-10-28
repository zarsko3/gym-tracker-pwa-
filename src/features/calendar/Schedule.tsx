import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Plus, CheckCircle } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';

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
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
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
    <div className="min-h-screen bg-[var(--color-primary)] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-figma-h1 text-white mb-1">Schedule</h1>
        <p className="text-figma-caption text-[var(--color-text-secondary)]">
          {dateStr}
        </p>
      </div>

      {/* Workout List */}
      <div className="px-6 space-y-4">
        {workoutList.map(([date, workout]) => {
          const workoutDate = new Date(date + 'T00:00:00');
          const isCompleted = workout.exercises.every(exercise => 
            exercise.sets.every(set => set.completed)
          );
          
          return (
            <div key={date} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getWorkoutTypeColor(workout.workoutType)}`}>
                    <span className="text-white font-bold text-lg">
                      {workoutDate.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-figma-h3 text-white">{workout.workoutType}</h3>
                    <p className="text-figma-caption text-[var(--color-text-secondary)]">
                      {workoutDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  <span className="text-figma-caption text-[var(--color-text-muted)]">
                    {workout.exercises.length} exercises
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--color-pink)] rounded-full flex items-center justify-center shadow-lg">
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="schedule" />
    </div>
  );
};

export default Schedule;
