import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Plus, CheckCircle, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/BottomNavigation';
import ScreenLayout from '../../components/ScreenLayout';
import LoadingSpinner from '../../components/LoadingSpinner';

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
  const navigate = useNavigate();
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
      <ScreenLayout>
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
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

  const handleWorkoutClick = (date: string) => {
    navigate(`/workout/${date}`);
  };

  const handleAddWorkout = () => {
    // Navigate to templates or workout selection
    navigate('/templates');
  };

  return (
    <ScreenLayout>
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <h1 className="text-[28px] font-bold text-white leading-tight tracking-[-0.5px]">
          Schedule
        </h1>
        <p className="text-white/60 text-[15px] mt-1">{dateStr}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {workoutList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 -mt-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No Workouts Scheduled</h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Start by adding your first workout to begin tracking your fitness journey.
            </p>
            <button 
              onClick={handleAddWorkout}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-yellow)] text-white font-medium shadow-lg transition-transform hover:scale-105"
            >
              Add Workout
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutList.map(([date, workout]) => {
              const workoutDate = new Date(date + 'T00:00:00');
              const isCompleted = workout.exercises.every((exercise) =>
                exercise.sets.every((set) => set.completed)
              );

              return (
                <div 
                  key={date} 
                  onClick={() => handleWorkoutClick(date)}
                  className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 cursor-pointer transition-all hover:bg-white/[0.12] hover:ring-white/20 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getWorkoutTypeColor(workout.workoutType)} shadow-md`}>
                        <span className="text-xl font-bold text-[#251B3D]">
                          {workoutDate.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-base capitalize">
                            {workout.workoutType}
                          </h3>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-white/60 text-sm">
                          {workoutDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {workoutList.length > 0 && (
        <button 
          onClick={handleAddWorkout}
          className="absolute bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-yellow)] shadow-[0_8px_24px_rgba(255,107,157,0.4)] transition-all hover:scale-110 active:scale-95 z-10"
          aria-label="Add workout"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      )}

      <BottomNavigation activeTab="schedule" className="flex-shrink-0 px-6 pb-6 pt-4" />
    </ScreenLayout>
  );
};

export default Schedule;
