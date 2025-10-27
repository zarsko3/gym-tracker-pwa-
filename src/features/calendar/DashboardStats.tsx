import React from 'react';
import { Calendar, Activity, Dumbbell, Target, TrendingUp } from 'lucide-react';

interface WorkoutData {
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
}

interface DashboardStatsProps {
  workouts: Record<string, WorkoutData>;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ workouts }) => {
  const calculateWorkoutVolume = (workout: WorkoutData) => {
    if (!workout || !workout.exercises) return 0;
    let totalVolume = 0;
    workout.exercises.forEach(ex => {
      if (ex.sets) {
        ex.sets.forEach(set => {
          totalVolume += (set.reps || 0) * (set.weight || 0);
        });
      }
    });
    return totalVolume;
  };

  const getWeekStats = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    let counts = { week: 0, Push: 0, Pull: 0, Legs: 0, Rest: 0 };
    let weeklyVolume = 0;
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      const dateString = dayDate.toISOString().split('T')[0];
      
      const workoutData = workouts[dateString];
      if (workoutData) {
        counts.week++;
        if (workoutData.workoutType in counts) {
          (counts as any)[workoutData.workoutType]++;
        }
        weeklyVolume += calculateWorkoutVolume(workoutData);
      }
    }
    
    return { counts, weeklyVolume };
  };

  const { counts, weeklyVolume } = getWeekStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Workouts This Week */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-600 text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Workouts This Week</p>
            <p className="text-3xl font-bold text-white">{counts.week} / 7</p>
          </div>
        </div>
      </div>

      {/* Weekly Volume */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-600 text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Weekly Volume (kg)</p>
            <p className="text-3xl font-bold text-white">{weeklyVolume.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Push Sessions */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-600 text-white">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Push Sessions</p>
            <p className="text-3xl font-bold text-white">{counts.Push}</p>
          </div>
        </div>
      </div>
      
      {/* Pull Sessions */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-600 text-white">
            <Target className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Pull Sessions</p>
            <p className="text-3xl font-bold text-white">{counts.Pull}</p>
          </div>
        </div>
      </div>

      {/* Leg Sessions */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-5">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-600 text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Leg Sessions</p>
            <p className="text-3xl font-bold text-white">{counts.Legs}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
