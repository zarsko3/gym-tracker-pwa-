import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { calculateTotalVolume, calculateSetsCompleted, calculateTotalSets, getWorkoutIntensity } from '../../utils/workoutCalculations';

interface Exercise {
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    completed?: boolean;
  }>;
}

interface WorkoutSummaryProps {
  exercises: Exercise[];
  workoutType: string;
  workoutDuration?: number; // in milliseconds
  previousWorkout?: {
    totalVolume: number;
    totalSets: number;
    date: string;
  };
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ 
  exercises, 
  workoutType, 
  workoutDuration = 0,
  previousWorkout 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalVolume = calculateTotalVolume(exercises);
  const setsCompleted = calculateSetsCompleted(exercises);
  const totalSets = calculateTotalSets(exercises);
  const intensity = getWorkoutIntensity(exercises);
  const completionPercentage = totalSets > 0 ? Math.round((setsCompleted / totalSets) * 100) : 0;

  const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity: string): string => {
    switch (intensity) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const volumeChange = previousWorkout 
    ? Math.round(((totalVolume - previousWorkout.totalVolume) / previousWorkout.totalVolume) * 100)
    : 0;

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Workout Summary</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Always visible summary */}
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Volume (kg)</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getProgressColor(completionPercentage)}`}>
            {completionPercentage}%
          </div>
          <div className="text-xs text-gray-400">Complete</div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-slide-down">
          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-white">{setsCompleted}/{totalSets}</div>
              <div className="text-xs text-gray-400">Sets Complete</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-white">{exercises.length}</div>
              <div className="text-xs text-gray-400">Exercises</div>
            </div>
          </div>

          {/* Workout Duration */}
          {workoutDuration > 0 && (
            <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm font-medium text-white">Duration</div>
                <div className="text-lg font-mono text-indigo-400">
                  {formatDuration(workoutDuration)}
                </div>
              </div>
            </div>
          )}

          {/* Intensity Level */}
          <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
            <Target className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-sm font-medium text-white">Intensity</div>
              <div className={`text-lg font-bold ${getIntensityColor(intensity)}`}>
                {intensity}
              </div>
            </div>
          </div>

          {/* Previous Workout Comparison */}
          {previousWorkout && (
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <div className="text-sm font-medium text-white">vs Last Workout</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Volume Change</div>
                  <div className={`font-bold ${volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {volumeChange >= 0 ? '+' : ''}{volumeChange}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Last Workout</div>
                  <div className="text-white">
                    {previousWorkout.totalVolume.toLocaleString()}kg
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Muscle Group Info */}
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-sm font-medium text-white mb-1">Muscle Groups</div>
            <div className="text-sm text-gray-400">
              {workoutType === 'Push' && 'Chest, Shoulders, Triceps'}
              {workoutType === 'Pull' && 'Back, Biceps'}
              {workoutType === 'Legs' && 'Quads, Hamstrings, Glutes, Calves'}
              {workoutType === 'Rest' && 'Recovery Day'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSummary;
