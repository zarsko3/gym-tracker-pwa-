import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

// Exact Figma design styles
const figmaStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: #e5e5e5;
    outline: none;
    border-radius: 2px;
    position: relative;
  }
  
  .slider::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: #e5e5e5;
    border-radius: 2px;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #262135;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    position: relative;
    z-index: 2;
  }
  
  .slider::-moz-range-track {
    height: 4px;
    background: #e5e5e5;
    border-radius: 2px;
    border: none;
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #262135;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  
  .timer-ring {
    transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .card-shadow {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
  
  .button-shadow {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
  
  .weight-slider-container {
    position: relative;
    background: white;
    border-radius: 16px;
    padding: 16px;
    height: 65px;
  }
  
  .weight-chip {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #262135;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 3;
  }
`;

type WorkoutType = 'push' | 'pull' | 'legs';

interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface WorkoutData {
  type: WorkoutType;
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentSetIndex: number;
  timer: number;
  isPaused: boolean;
}

// PPL Exercise Templates
const WORKOUT_TEMPLATES = {
  push: [
    'Bench Press',
    'Overhead Shoulder Press',
    'Incline Dumbbell Press',
    'Lateral Raises',
    'Triceps Pushdowns',
    'Dips',
  ],
  pull: [
    'Pull-ups',
    'Bent-over Rows',
    'Lat Pulldowns',
    'Face Pulls',
    'Bicep Curls',
    'Hammer Curls',
  ],
  legs: [
    'Squats',
    'Romanian Deadlifts',
    'Leg Press',
    'Walking Lunges',
    'Calf Raises',
    'Leg Curls',
  ],
};

const WorkoutScreen: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const workoutType = (searchParams.get('type') || 'push') as WorkoutType;
  
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    type: workoutType,
    exercises: [],
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    timer: 0,
    isPaused: false,
  });

  // Initialize workout data
  useEffect(() => {
    const exerciseNames = WORKOUT_TEMPLATES[workoutType];
    const exercises: Exercise[] = exerciseNames.map((name, index) => ({
      id: `exercise-${index}`,
      name,
      sets: [{
        id: `set-${index}-0`,
        reps: 10,
        weight: 70,
        completed: false,
      }],
    }));

    setWorkoutData(prev => ({
      ...prev,
      exercises,
    }));
  }, [workoutType]);

  // Timer effect
  useEffect(() => {
    if (!workoutData.isPaused) {
      timerRef.current = setInterval(() => {
        setWorkoutData(prev => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutData.isPaused]);

  const currentExercise = workoutData.exercises[workoutData.currentExerciseIndex];
  const currentSet = currentExercise?.sets[workoutData.currentSetIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleWeightChange = (weight: number) => {
    if (!currentSet) return;

    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, exIndex) => 
        exIndex === prev.currentExerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, setIndex) =>
                setIndex === prev.currentSetIndex
                  ? { ...set, weight }
                  : set
              ),
            }
          : exercise
      ),
    }));
  };

  const handleRepsChange = (reps: number) => {
    if (!currentSet) return;

    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, exIndex) => 
        exIndex === prev.currentExerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, setIndex) =>
                setIndex === prev.currentSetIndex
                  ? { ...set, reps }
                  : set
              ),
            }
          : exercise
      ),
    }));
  };

  const addSet = () => {
    if (!currentExercise) return;

    const newSet: Set = {
      id: `set-${workoutData.currentExerciseIndex}-${currentExercise.sets.length}`,
      reps: currentSet?.reps || 10,
      weight: currentSet?.weight || 70,
      completed: false,
    };

    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, exIndex) => 
        exIndex === prev.currentExerciseIndex
          ? {
              ...exercise,
              sets: [...exercise.sets, newSet],
            }
          : exercise
      ),
    }));
  };

  const completeSet = () => {
    if (!currentSet) return;

    setWorkoutData(prev => {
      const updatedExercises = prev.exercises.map((exercise, exIndex) => 
        exIndex === prev.currentExerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, setIndex) =>
                setIndex === prev.currentSetIndex
                  ? { ...set, completed: true }
                  : set
              ),
            }
          : exercise
      );

      // Move to next set or next exercise
      const currentExercise = updatedExercises[prev.currentExerciseIndex];
      const nextSetIndex = prev.currentSetIndex + 1;
      
      if (nextSetIndex < currentExercise.sets.length) {
        // Move to next set
        return {
          ...prev,
          exercises: updatedExercises,
          currentSetIndex: nextSetIndex,
          timer: 0, // Reset timer for new set
        };
      } else {
        // Move to next exercise
        const nextExerciseIndex = prev.currentExerciseIndex + 1;
        if (nextExerciseIndex < updatedExercises.length) {
          return {
            ...prev,
            exercises: updatedExercises,
            currentExerciseIndex: nextExerciseIndex,
            currentSetIndex: 0,
            timer: 0, // Reset timer for new exercise
          };
        } else {
          // Workout complete
          navigate('/workout-success');
          return prev;
        }
      }
    });
  };

  const togglePause = () => {
    setWorkoutData(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const selectExercise = (index: number) => {
    setWorkoutData(prev => ({
      ...prev,
      currentExerciseIndex: index,
      currentSetIndex: 0,
      timer: 0,
    }));
  };

  if (!currentExercise || !currentSet) {
    return (
      <ScreenLayout contentClassName="flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading workout...</p>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <>
      <style>{figmaStyles}</style>
      <div className="fixed inset-0 w-full h-full text-white overflow-hidden" style={{ backgroundColor: '#262135' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-3 pb-2">
        <span className="text-white text-sm font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center text-white hover:opacity-80 transition-opacity"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(13.9px)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Timer Ring */}
        <div className="relative" style={{ width: '64px', height: '64px' }}>
          <svg className="-rotate-90" width="64" height="64" viewBox="0 0 36 36">
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="3"
            />
            <circle
              cx="18" 
              cy="18" 
              r="16" 
              fill="none"
              stroke="url(#timerGradient)" 
              strokeWidth="3"
              strokeDasharray="100"
              strokeDashoffset={100 - (workoutData.timer % 60) * (100 / 60)}
              strokeLinecap="round"
              className="timer-ring"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#ffd966" />
              </linearGradient>
            </defs>
          </svg>
          <div 
            className="absolute inset-0 flex items-center justify-center text-white font-semibold"
            style={{ 
              fontSize: '12px',
              fontFamily: 'Montserrat Alternates',
              fontWeight: 600
            }}
          >
            {formatTime(workoutData.timer)}
          </div>
        </div>
      </div>

      {/* Exercise Title */}
      <div className="px-6 mt-8 text-center text-white">
        <h1 
          className="text-white"
          style={{
            fontSize: '20px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 700,
            lineHeight: '21.6px',
            letterSpacing: '0px'
          }}
        >
          {currentExercise.name}
        </h1>
        <p 
          className="text-white/60 mt-3"
          style={{
            fontSize: '12px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 500,
            lineHeight: '12.12px',
            letterSpacing: '0px'
          }}
        >
          Set {workoutData.currentSetIndex + 1} of {currentExercise.sets.length}
        </p>
      </div>

      {/* Set Summary Card */}
      <div className="px-6 mt-8">
        <div 
          className="mb-6"
          style={{
            backgroundColor: '#464A5C',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div 
              className="text-white"
              style={{
                fontSize: '14px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                lineHeight: '15.12px'
              }}
            >
              Set {workoutData.currentSetIndex + 1}
            </div>
            <div 
              className="text-white"
              style={{
                fontSize: '14px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                lineHeight: '15.12px'
              }}
            >
              {currentSet.reps} reps
            </div>
            <div 
              className="text-white"
              style={{
                fontSize: '14px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                lineHeight: '15.12px'
              }}
            >
              {currentSet.weight} kg
            </div>
          </div>
        </div>
      </div>

      {/* Weight Control */}
      <div className="px-6 mb-6">
        <div 
          className="text-white/80 text-center mb-4"
          style={{
            fontSize: '14px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 500,
            lineHeight: '15.12px'
          }}
        >
          Weight (kg)
        </div>
        
        {/* Weight Slider Container */}
        <div className="weight-slider-container">
          {/* Weight Label Chip - positioned above slider */}
          <div className="weight-chip">
            {currentSet.weight}
          </div>
          
          {/* Weight Slider */}
          <div className="relative pt-4">
            <input
              type="range"
              min="50"
              max="90"
              step="2.5"
              value={currentSet.weight}
              className="w-full appearance-none bg-transparent cursor-pointer slider"
              onChange={(e) => handleWeightChange(Number(e.target.value))}
            />
            
            {/* Tick marks with exact positioning */}
            <div 
              className="absolute top-4 left-0 right-0 flex justify-between"
              style={{
                fontSize: '10px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                color: 'rgba(38, 33, 53, 0.7)',
                paddingTop: '8px'
              }}
            >
              {[50,60,70,80,90].map((n, index) => (
                <span 
                  key={n}
                  className="text-center"
                  style={{
                    width: '20px',
                    marginLeft: index === 0 ? '0' : '-10px'
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {/* Plus Button */}
        <button 
          onClick={addSet}
          className="bg-white text-[#262135] rounded-full hover:scale-110 active:scale-95 transition-transform"
          style={{
            width: '40px',
            height: '40px',
            fontSize: '20px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 700,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          +
        </button>

        {/* Pause/Complete Button */}
        <button
          onClick={workoutData.isPaused ? togglePause : completeSet}
          className="rounded-full text-white hover:scale-105 active:scale-95 transition-transform"
          style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            fontSize: '18px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 700,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {workoutData.isPaused ? '▶' : '‖'}
        </button>
      </div>

      {/* Bottom Exercise List */}
      <div className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-6">
        <div 
          className="bg-white"
          style={{
            borderRadius: '28px',
            padding: '20px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
            minHeight: '287px'
          }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="text-[#262135]"
              style={{
                fontSize: '14px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                lineHeight: '15.12px'
              }}
            >
              Exercise List
            </div>
            <div 
              className="text-[#262135]/60"
              style={{
                fontSize: '12px',
                fontFamily: 'Montserrat Alternates',
                fontWeight: 500,
                lineHeight: '12.12px'
              }}
            >
              {workoutData.currentExerciseIndex + 1} of {workoutData.exercises.length}
            </div>
          </div>

          {/* Exercise List */}
          <ul className="space-y-2">
            {workoutData.exercises.map((exercise, i) => {
              const active = i === workoutData.currentExerciseIndex;
              return (
                <li
                  key={exercise.id}
                  className={[
                    "w-full cursor-pointer transition-all duration-200",
                    active 
                      ? "text-white shadow-lg" 
                      : "text-[#262135] hover:bg-gray-100"
                  ].join(" ")}
                  style={{
                    borderRadius: '16px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontFamily: 'Montserrat Alternates',
                    fontWeight: 500,
                    lineHeight: '15.12px',
                    background: active 
                      ? 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)' 
                      : '#F5F5F5',
                    minHeight: '37px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => selectExercise(i)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {active && (
                        <div 
                          className="bg-white rounded-full flex-shrink-0"
                          style={{ width: '8px', height: '8px' }}
                        ></div>
                      )}
                      <span className="truncate">{exercise.name}</span>
                    </div>
                    {active && (
                      <div 
                        className="bg-white rounded-full flex-shrink-0"
                        style={{ width: '6px', height: '6px' }}
                      ></div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      </div>
    </>
  );
};

export default WorkoutScreen;