import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle } from 'lucide-react';
import { calculateTotalVolume, calculateSetsCompleted, calculateTotalSets } from '../../utils/workoutCalculations';

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

interface TodayWorkoutCardProps {
  todayWorkout?: WorkoutData;
  todayDate: string;
}

const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({ todayWorkout, todayDate }) => {
  const navigate = useNavigate();
  
  const isCompleted = todayWorkout && 
    calculateSetsCompleted(todayWorkout.exercises) === calculateTotalSets(todayWorkout.exercises);
  
  const handleStartWorkout = () => {
    navigate(`/workout/${todayDate}`);
  };

  return (
    <div className="glass-card p-6 mb-6 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/10 via-transparent to-[var(--color-yellow)]/10 pointer-events-none" />
      
      {/* Exercise Details - Matching Figma */}
      <div className="relative z-10">
        <h2 className="text-lg font-medium text-white mb-2">Push Up</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">20 reps , 3 sets with 10 sec rest</p>
        
        {/* Weight Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--color-pink)] rounded-full"></div>
            <span className="text-sm text-[var(--color-text-secondary)]">Weight</span>
          </div>
          <div className="bg-[var(--color-yellow)]/20 px-3 py-1 rounded-lg">
            <span className="text-sm font-semibold text-[var(--color-primary)]">505 KG</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartWorkout}
          className="btn-figma-primary w-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <Play className="w-5 h-5" />
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default TodayWorkoutCard;
