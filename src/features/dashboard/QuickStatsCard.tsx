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
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-figma-h3 text-white">Quick Stats</h3>
        <div className="w-2 h-2 bg-[var(--color-pink)] rounded-full"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center group">
            <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-400', '-500/20')} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{stat.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStatsCard;
