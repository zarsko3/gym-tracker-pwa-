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
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <p className="text-figma-caption text-[var(--color-text-secondary)]">Today's Workout</p>
          <h2 className="text-figma-h2 text-[var(--color-text-primary)] mt-1">
            {todayWorkout?.workoutType || 'Rest Day'}
          </h2>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Completed</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {todayWorkout && todayWorkout.workoutType !== 'Rest' && (
        <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {todayWorkout.exercises.length}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {calculateSetsCompleted(todayWorkout.exercises)}/{calculateTotalSets(todayWorkout.exercises)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Sets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {calculateTotalVolume(todayWorkout.exercises).toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Volume (kg)</p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleStartWorkout}
        className="btn-figma-primary w-full flex items-center justify-center gap-2 relative z-10 hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <Play className="w-5 h-5" />
        {isCompleted ? 'View Workout' : todayWorkout ? 'Continue Workout' : 'Start Workout'}
      </button>
    </div>
  );
};

export default TodayWorkoutCard;
