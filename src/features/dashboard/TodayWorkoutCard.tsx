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
    <div className="card-modern card-elevated gradient-overlay p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-category">Today's Workout</p>
          <h2 className="text-heading-xl text-white mt-1">
            {todayWorkout?.workoutType || 'Rest Day'}
          </h2>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Completed</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {todayWorkout && todayWorkout.workoutType !== 'Rest' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {todayWorkout.exercises.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {calculateSetsCompleted(todayWorkout.exercises)}/{calculateTotalSets(todayWorkout.exercises)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Sets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {calculateTotalVolume(todayWorkout.exercises).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">Volume (kg)</p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleStartWorkout}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
      >
        <Play className="w-5 h-5" />
        {isCompleted ? 'View Workout' : todayWorkout ? 'Continue Workout' : 'Start Workout'}
      </button>
    </div>
  );
};

export default TodayWorkoutCard;
