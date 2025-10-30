import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Play, Pause, CheckCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getExercisesForWorkout, type ExerciseData } from '../../services/templates';
import ScreenLayout from '../../components/ScreenLayout';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

// Custom styles for slider and other elements
const figmaStyles = `
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: var(--track-height);
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(255,107,157,0.4), 0 1px 3px rgba(0,0,0,0.1);
    position: relative;
    z-index: 2;
    border: 2px solid white;
    transition: all 0.2s ease;
    margin-top: -7.5px;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
  }
  
  input[type="range"]::-moz-range-track {
    height: var(--track-height);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    border: none;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 3px 8px rgba(255,107,157,0.4), 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
  }
  
  input[type="range"]:focus {
    outline: none;
  }
  
  input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 2px #FFB86C, 0 4px 12px rgba(255,107,157,0.4);
  }
  
  input[type="range"]:focus::-moz-range-thumb {
    box-shadow: 0 0 0 2px #FFB86C, 0 4px 12px rgba(255,107,157,0.4);
  }
  
  .timer-ring {
    transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Custom scrollbar for exercise list */
  .exercise-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .exercise-list::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 3px;
  }
  
  .exercise-list::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 3px;
  }
  
  .exercise-list::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #ff5a8a 0%, #ffd055 100%);
  }
  
  /* Custom scrollbar for main content */
  main::-webkit-scrollbar {
    width: 4px;
  }
  
  main::-webkit-scrollbar-track {
    background: transparent;
  }
  
  main::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
  
  main::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

type WorkoutType = 'Push' | 'Pull' | 'Legs';

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
  exerciseData: ExerciseData;
}

const WorkoutScreen: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const workoutTypeParam = searchParams.get('type') || 'Push';
  const workoutType = (workoutTypeParam.charAt(0).toUpperCase() + workoutTypeParam.slice(1).toLowerCase()) as WorkoutType;
  
  // Timer state
  const REST_PERIOD = 90; // 90 second rest timer
  const [timer, setTimer] = useState(REST_PERIOD);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const timerRef = useRef<number | null>(null);
  
  // Exercise data - initialize with PPL data
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Current exercise state
  const [currentExerciseId, setCurrentExerciseId] = useState('1');
  const currentExercise = exercises.find(ex => ex.id === currentExerciseId) || exercises[0];
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Initialize exercises with PPL data
  useEffect(() => {
    console.log('Initializing exercises for workout type:', workoutType);
    const pplExercises = getExercisesForWorkout(workoutType);
    console.log('PPL exercises found:', pplExercises);
    
    if (pplExercises.length === 0) {
      console.error('No exercises found for workout type:', workoutType);
      setIsLoading(false);
      return;
    }
    
    const initializedExercises: Exercise[] = pplExercises.map((exerciseData, index) => ({
      id: (index + 1).toString(),
      name: exerciseData.name,
      exerciseData,
      sets: [{
        id: `${index + 1}-1`,
        reps: parseInt(exerciseData.reps.split('-')[0]), // Use minimum reps from range
        weight: exerciseData.weight.min,
        completed: false
      }]
    }));
    
    console.log('Initialized exercises:', initializedExercises);
    setExercises(initializedExercises);
    setIsLoading(false);
  }, [workoutType]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = window.setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 0) {
            setIsTimerActive(false); // Stop timer at 0
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
        clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  // Helper to format timer
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Handle finish workout
  const handleFinishWorkout = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const dateStr = date || new Date().toISOString().split('T')[0];
    
    try {
      // Prepare workout data for database
      const workoutData = {
        date: dateStr,
        workoutType: workoutType.toLowerCase(),
        templateId: 'ppl-default',
        completed: true,
        completedAt: serverTimestamp(),
        exercises: exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            completed: set.completed
          }))
        }))
      };

      // Save to Firebase
      await setDoc(
        doc(db, 'users', user.uid, 'workouts', dateStr),
        workoutData
      );

      console.log('Workout saved successfully');
      
      // Navigate to success screen
      navigate(`/workout-success?date=${dateStr}&type=${workoutType}`);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    }
  };

  // Handle reps change for a set
  const handleRepsChange = (setId: string, change: number) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => {
        if (ex.id === currentExerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id === setId) {
                return {
                  ...set,
                  reps: Math.max(1, set.reps + change)
                };
              }
              return set;
            })
          };
        }
        return ex;
      })
    );
  };

  // Handle weight change for a set
  const handleWeightChange = (setId: string, newWeight: number) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => {
        if (ex.id === currentExerciseId) {
          const exerciseData = ex.exerciseData;
          const clampedWeight = Math.max(
            exerciseData.weight.min, 
            Math.min(exerciseData.weight.max, newWeight)
          );
          
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id === setId) {
                return {
                  ...set,
                  weight: clampedWeight
                };
              }
              return set;
            })
          };
        }
        return ex;
      })
    );
  };

  // Add a new set
  const addSet = () => {
    setExercises(prevExercises => 
      prevExercises.map(ex => {
        if (ex.id === currentExerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSetId = `${ex.id}-${ex.sets.length + 1}`;
          
          return {
            ...ex,
            sets: [
              ...ex.sets,
              { 
                id: newSetId, 
                reps: lastSet.reps, 
                weight: lastSet.weight, 
                completed: false 
              }
            ]
          };
        }
        return ex;
      })
    );
    
    // Reset timer when adding a set
    setTimer(REST_PERIOD);
    setIsTimerActive(true);
  };

  // Change current exercise
  const changeExercise = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
  };

  // Show loading state while exercises are being initialized
  if (isLoading || exercises.length === 0) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#1B1631] text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading {workoutType} workout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{figmaStyles}</style>
      <ScreenLayout>
          
          {/* 1. Header with back button and timer */}
          <header className="flex-shrink-0 grid grid-cols-12 px-6 pt-6 pb-4 items-center z-10">
            <div className="col-span-4">
        <button
          onClick={handleBack}
                className="w-[48px] h-[48px] rounded-2xl flex items-center justify-center bg-white/8 shadow-[inset_0_2px_6px_rgba(255,255,255,.06)] ring-1 ring-white/6"
                aria-label="Go back"
        >
                <ChevronLeft size={24} color="white" />
        </button>
            </div>
            
            {/* Timer Component */}
            <div className="col-span-4 col-start-9 flex justify-end">
              <div className="relative">
                <div 
                  className="w-[92px] h-[92px] rounded-full bg-[radial-gradient(60%_60%_at_30%_25%,#FFB86C,transparent),radial-gradient(70%_70%_at_70%_80%,#FF7CA4,transparent)] shadow-[0_8px_24px_rgba(0,0,0,.35)] ring-1 ring-white/12 flex items-center justify-center"
                >
                  <div className="absolute inset-2 rounded-full bg-white/5 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-white/90 text-[18px] font-semibold">
                      {formatTime(timer)}
                    </span>
                  </div>
          </div>
        </div>
      </div>
          </header>

          {/* 2. Main Content Area - Scrollable */}
          <main className="flex-1 px-6 pb-[320px] overflow-y-auto">
      {/* Exercise Title */}
            <div className="text-center mb-4">
              <h1 
                className="text-[18px] leading-tight font-extrabold tracking-[-0.2px] text-white"
              >
          {currentExercise.name}
        </h1>
            </div>

            {/* Sets Section */}
            <div className="space-y-2.5">
              {currentExercise.sets.map((set, index) => (
                <div key={set.id} className="rounded-2xl bg-white/10 ring-1 ring-white/10 px-4 py-3.5">
                  {/* Set Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-white/70 text-[13px] font-medium">
                      Set {index + 1}
                    </span>
                  </div>
                  
                  {/* Reps and Weight Row */}
                  <div className="flex items-center gap-3">
                    {/* Reps Control */}
                    <div className="h-12 px-3 rounded-xl bg-white/8 ring-1 ring-white/8 flex items-center gap-3">
                      <button 
                        onClick={() => handleRepsChange(set.id, -1)}
                        className="text-white/90 text-lg w-6 h-6 flex items-center justify-center"
                        aria-label="Decrease reps"
                      >
                        −
                      </button>
                      
                      <div className="flex items-baseline gap-1 min-w-[48px] justify-center">
                        <span className="text-white font-semibold text-base">{set.reps}</span>
                        <span className="text-white/60 text-xs">reps</span>
                      </div>
                      
                      <button 
                        onClick={() => handleRepsChange(set.id, 1)}
                        className="text-white/90 text-lg w-6 h-6 flex items-center justify-center"
                        aria-label="Increase reps"
                      >
                        +
                      </button>
      </div>

                    {/* Weight Display */}
                    <div className="flex-1 flex items-baseline justify-end gap-1.5 font-mono">
                      <span className="text-white text-xl font-bold">{set.weight}</span>
                      <span className="text-white/70 text-sm font-medium">kg</span>
          </div>
        </div>

                  {/* Weight Slider */}
                  <div className="mt-3 px-0.5">
              <input
                type="range"
                      min={currentExercise.exerciseData.weight.min} 
                      max={currentExercise.exerciseData.weight.max} 
                      step={currentExercise.exerciseData.weight.increment}
                      value={set.weight}
                      onChange={(e) => handleWeightChange(set.id, parseFloat(e.target.value))}
                      className="w-full h-5 appearance-none bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFB86C]"
                style={{
                        // Custom properties for slider styling
                        ['--track-height' as any]: '5px',
                        ['--thumb-size' as any]: '20px',
                      }}
                      aria-label="Weight slider"
                    />
                    <div className="flex justify-between mt-1 text-[9px] text-white/30 font-mono">
                      <span>{currentExercise.exerciseData.weight.min}</span>
                      <span>{Math.round((currentExercise.exerciseData.weight.min + currentExercise.exerciseData.weight.max) / 4)}</span>
                      <span>{Math.round((currentExercise.exerciseData.weight.min + currentExercise.exerciseData.weight.max) / 2)}</span>
                      <span>{Math.round(3 * (currentExercise.exerciseData.weight.min + currentExercise.exerciseData.weight.max) / 4)}</span>
                      <span>{currentExercise.exerciseData.weight.max}</span>
              </div>
            </div>
          </div>
              ))}
      </div>

            {/* Add Set Button */}
            <div className="flex justify-center mt-4">
        <button 
          onClick={addSet}
                className="flex items-center justify-center px-4 py-2 rounded-full bg-white text-[var(--color-primary)] font-medium transition-all hover:scale-105 hover:translate-y-[-2px] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
                aria-label="Add set"
        >
                <Plus size={16} className="mr-4" />
                <span>Add Set</span>
        </button>
      </div>

            {/* Finish Workout Button */}
            <div className="flex justify-center mt-6">
        <button
          onClick={handleFinishWorkout}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#E8D5FF] to-[#D4C5F9] text-[#2B2440] font-bold text-base transition-all hover:scale-105 hover:shadow-[0_8px_24px_rgba(232,213,255,0.4)] shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
                aria-label="Finish workout"
        >
                <CheckCircle size={20} className="flex-shrink-0" />
                <span>Finish Workout</span>
        </button>
      </div>
          </main>

          {/* 3. Bottom Sheet with Exercise List */}
          <div className="absolute bottom-0 left-0 right-0 h-[287px] rounded-t-[27px] bg-white ring-1 ring-black/5 shadow-[0_18px_44px_rgba(0,0,0,0.32)] overflow-hidden z-20 mx-auto max-w-[390px]">
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 px-6 pt-5 pb-3 flex justify-between items-center">
                <h3 className="text-[#2A2E34]/60 text-[13px] font-medium">Exercise List</h3>
                <span className="text-[#2A2E34]/60 text-[13px]">
                  {exercises.findIndex(ex => ex.id === currentExerciseId) + 1} of {exercises.length}
                </span>
      </div>

              <div className="flex-1 overflow-y-auto exercise-list px-6 pb-4">
                <div className="space-y-2">
                  {exercises.map(exercise => (
                    <div
                      key={exercise.id}
                      onClick={() => changeExercise(exercise.id)}
                      className={`
                        h-[52px] flex items-center justify-between px-4 cursor-pointer transition-all
                        ${exercise.id === currentExerciseId 
                          ? 'rounded-2xl bg-[linear-gradient(90deg,#FF7CA4_0%,#FFB86C_100%)] text-[#1C1B2A] font-semibold shadow-[0_8px_18px_rgba(0,0,0,.18)]' 
                          : 'rounded-xl bg-[#F4F5F7] text-[#1F2937] shadow-[inset_0_1px_0_rgba(255,255,255,.6)]'
                        }
                      `}
                    >
                      <span className="text-[14px]">{exercise.name}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        exercise.id === currentExerciseId 
                          ? 'bg-white/20' 
                          : 'bg-white/50'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          exercise.id === currentExerciseId 
                            ? 'bg-[#FFC34D]' 
                            : 'bg-[#D1D5DB]'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            </div>
          </div>

          {/* 4. Pause Button */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[251px] z-30">
            <button 
              onClick={() => setIsTimerActive(!isTimerActive)}
              className="w-[72px] h-[72px] rounded-full bg-[#F4F0B0] flex items-center justify-center shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
              aria-label={isTimerActive ? "Pause workout" : "Resume workout"}
            >
              {isTimerActive ? (
                <div className="flex">
                  <div className="w-[5px] h-[39px] bg-black rounded-lg mx-[5px]"></div>
                  <div className="w-[5px] h-[39px] bg-black rounded-lg mx-[5px]"></div>
                </div>
              ) : (
                <Play size={24} color="black" />
              )}
            </button>
                  </div>
      </ScreenLayout>
    </>
  );
};

export default WorkoutScreen;