import React from 'react';
import { TrendingUp, Zap, Calendar } from 'lucide-react';
import { calculateTotalVolume } from '../../utils/workoutCalculations';

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

interface QuickStatsCardProps {
  workouts: Record<string, WorkoutData>;
}

const calculateStreak = (workouts: Record<string, WorkoutData>): number => {
  const sortedDates = Object.keys(workouts)
    .sort((a, b) => b.localeCompare(a));
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const workoutDate = new Date(sortedDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (workoutDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ workouts }) => {
  const last7Days = Object.entries(workouts)
    .filter(([date]) => {
      const workoutDate = new Date(date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return workoutDate >= sevenDaysAgo;
    });

  const weeklyWorkouts = last7Days.length;
  const weeklyVolume = last7Days.reduce((sum, [_, workout]) => 
    sum + calculateTotalVolume(workout.exercises), 0);
  
  const currentStreak = calculateStreak(workouts);

  const stats = [
    {
      icon: Calendar,
      label: 'This Week',
      value: weeklyWorkouts,
      unit: 'workouts',
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      label: 'Volume',
      value: (weeklyVolume / 1000).toFixed(1),
      unit: 't',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      label: 'Streak',
      value: currentStreak,
      unit: 'days',
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="glass-card p-4 mb-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsCard;
