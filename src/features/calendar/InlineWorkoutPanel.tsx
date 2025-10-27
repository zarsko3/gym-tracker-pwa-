import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { DEFAULT_TEMPLATES } from '../../services/templates';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import { useRestTimer } from '../../hooks/useRestTimer';
import { calculateTotalVolume, calculateSetsCompleted, calculateTotalSets } from '../../utils/workoutCalculations';
import { hapticLight, hapticSuccess, hapticSelection } from '../../utils/hapticFeedback';
import { X, Play, Pause, Square, Clock, CheckCircle } from 'lucide-react';
import ExerciseCard from '../workout/ExerciseCard';

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

interface InlineWorkoutPanelProps {
  date: string;
  existingWorkout?: WorkoutData;
  onClose: () => void;
}

const WORKOUT_TYPES = ['Push', 'Pull', 'Legs', 'Rest'] as const;

const InlineWorkoutPanel: React.FC<InlineWorkoutPanelProps> = ({ 
  date, 
  existingWorkout, 
  onClose 
}) => {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(existingWorkout || null);
  const [selectedType, setSelectedType] = useState<string>(existingWorkout?.workoutType || '');
  const [exercises, setExercises] = useState<WorkoutData['exercises']>(existingWorkout?.exercises || []);
  const [saving, setSaving] = useState(false);
  
  const workoutTimer = useWorkoutTimer();
  const restTimer = useRestTimer(90);

  useEffect(() => {
    if (existingWorkout) {
      setWorkoutData(existingWorkout);
      setSelectedType(existingWorkout.workoutType);
      setExercises(existingWorkout.exercises);
    }
  }, [existingWorkout]);

  const handleWorkoutTypeSelect = (type: string) => {
    hapticSelection();
    
    if (type === 'Rest') {
      handleSaveWorkout('Rest', []);
      return;
    }

    setSelectedType(type);
    const template = DEFAULT_TEMPLATES['ppl-default'];
    const exerciseNames = template.workouts[type as keyof typeof template.workouts] || [];
    
    const newExercises = exerciseNames.map((name: string) => ({
      name,
      sets: [{ reps: 0, weight: 0, completed: false }]
    }));
    
    setExercises(newExercises);
  };

  const handleExerciseUpdate = (index: number, updatedExercise: WorkoutData['exercises'][0]) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  const handleSaveWorkout = async (type?: string, exerciseData?: WorkoutData['exercises']) => {
    if (!user || !date) return;

    setSaving(true);
    try {
      const workoutType = type || selectedType;
      const exerciseList = exerciseData || exercises;

      const workoutToSave: WorkoutData = {
        date,
        workoutType,
        templateId: 'ppl-default',
        exercises: exerciseList
      };

      const workoutRef = doc(db, 'users', user.uid, 'workouts', date);
      await setDoc(workoutRef, workoutToSave);
      
      setWorkoutData(workoutToSave);
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStartWorkout = () => {
    hapticSuccess();
    workoutTimer.start();
  };

  const handleSetComplete = () => {
    hapticLight();
    restTimer.start();
  };

  const totalVolume = calculateTotalVolume(exercises);
  const setsCompleted = calculateSetsCompleted(exercises);
  const totalSets = calculateTotalSets(exercises);

  return (
    <div className="inline-workout-panel bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-slide-down">
      {/* Header at top - informational */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </h3>
          <div className="timer-display">{workoutTimer.formattedTime}</div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
        {/* Timer Section */}
        {selectedType && selectedType !== 'Rest' && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-gray-300">Workout Timer</span>
              </div>
              <div className="flex items-center gap-2">
                {!workoutTimer.isActive ? (
                  <button
                    onClick={handleStartWorkout}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={workoutTimer.pause}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                      <Pause className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={workoutTimer.stop}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                      <Square className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-400">
              {workoutTimer.formattedTime}
            </div>
          </div>
        )}

        {/* Rest Timer */}
        {restTimer.isActive && (
          <div className="p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Rest Time</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={restTimer.pause}
                  className="p-1 hover:bg-blue-800/50 rounded transition-colors"
                >
                  <Pause className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={restTimer.skip}
                  className="p-1 hover:bg-blue-800/50 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-blue-400">
              {restTimer.formattedTime}
            </div>
          </div>
        )}

        {/* Workout Type Selector */}
        {!selectedType && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Select Workout Type</h4>
            <div className="grid grid-cols-2 gap-3">
              {WORKOUT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleWorkoutTypeSelect(type)}
                  className={`btn-ios ${
                    type === 'Push' ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' :
                    type === 'Pull' ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' :
                    type === 'Legs' ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' :
                    'bg-gray-600 hover:bg-gray-700 active:bg-gray-800'
                  }`}
                  aria-label={`Select ${type} workout`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Workout Summary */}
        {selectedType && selectedType !== 'Rest' && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Volume (kg)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{setsCompleted}/{totalSets}</div>
                <div className="text-xs text-gray-400">Sets Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{exercises.length}</div>
                <div className="text-xs text-gray-400">Exercises</div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        {selectedType && selectedType !== 'Rest' && (
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                exercise={exercise}
                onUpdate={(updatedExercise) => handleExerciseUpdate(index, updatedExercise)}
                workoutDate={date}
                onSetComplete={handleSetComplete}
              />
            ))}
          </div>
        )}

        {selectedType === 'Rest' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">😴</div>
            <p className="text-gray-400">Rest day logged</p>
          </div>
        )}
      </div>

      {/* Sticky bottom controls - thumb zone */}
      {selectedType && (
        <div className="sticky bottom-0 p-4 bg-gray-800 border-t border-gray-700 pb-safe-bottom">
          <div className="flex gap-3">
            <button
              onClick={() => handleSaveWorkout()}
              disabled={saving}
              className="btn-ios flex-1"
            >
              {saving ? 'Saving...' : 'Save Workout'}
            </button>
            <button
              onClick={onClose}
              className="btn-ios-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineWorkoutPanel;
