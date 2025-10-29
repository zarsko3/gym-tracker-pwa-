import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Play, Pause } from 'lucide-react';

// Custom styles for slider and other elements
const figmaStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    outline: none;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    border-radius: 3px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255,107,157,0.4), 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    z-index: 2;
    border: 2px solid white;
    transition: all 0.2s ease;
  }
  
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
  }
  
  .slider::-moz-range-track {
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    border-radius: 3px;
    border: none;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 4px 12px rgba(255,107,157,0.4), 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  
  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
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
`;

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

const TestWorkoutScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // Timer state
  const REST_PERIOD = 90; // 90 second rest timer
  const [timer, setTimer] = useState(REST_PERIOD);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const timerRef = useRef<number | null>(null);
  
  // Exercise data
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      sets: [{ id: '1-1', reps: 10, weight: 70, completed: false }]
    },
    {
      id: '2',
      name: 'Overhead Press',
      sets: [{ id: '2-1', reps: 8, weight: 50, completed: false }]
    },
    {
      id: '3',
      name: 'Incline Press',
      sets: [{ id: '3-1', reps: 12, weight: 40, completed: false }]
    },
    {
      id: '4',
      name: 'Lateral Raises',
      sets: [{ id: '4-1', reps: 15, weight: 20, completed: false }]
    },
    {
      id: '5',
      name: 'Triceps Extensions',
      sets: [{ id: '5-1', reps: 12, weight: 35, completed: false }]
    }
  ]);
  
  // Current exercise state
  const [currentExerciseId, setCurrentExerciseId] = useState('1');
  const currentExercise = exercises.find(ex => ex.id === currentExerciseId) || exercises[0];

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
    navigate('/');
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
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id === setId) {
                return {
                  ...set,
                  weight: newWeight
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

  return (
    <>
      <style>{figmaStyles}</style>
      <div className="w-full min-h-screen bg-[var(--color-primary)] p-4 flex items-center justify-center">
        <div className="w-[390px] h-[844px] relative text-white font-sans overflow-hidden" style={{ background: 'var(--color-primary)' }}>
          <div className="absolute top-0 left-0 right-0 w-full p-4 text-center bg-[var(--color-card-dark)] z-50">
            <h1 className="text-xl font-bold">Test Workout Screen</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">This is a test version of the workout screen</p>
          </div>
          
          {/* 1. Header with back button and timer */}
          <header className="absolute top-20 left-0 right-0 px-6 pt-8 flex justify-between items-center z-10">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center glass-card-light"
              aria-label="Go back"
            >
              <ChevronLeft size={24} color="white" />
            </button>
            
            {/* Timer Component */}
            <div className="relative">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isTimerActive 
                    ? 'bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-yellow)]' 
                    : 'bg-[var(--color-card-dark)]'
                }`}
              >
                <div className="absolute inset-1 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white text-base font-semibold">
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* 2. Main Content Area */}
          <main className="w-full h-full pt-40 px-6 flex flex-col">
            {/* Exercise Title */}
            <div className="mt-8 text-center">
              <h1 className="text-figma-h2 text-[var(--color-text-primary)]">
                {currentExercise.name}
              </h1>
            </div>

            {/* Sets Section */}
            <div className="mt-8 space-y-4">
              {currentExercise.sets.map((set, index) => (
                <div key={set.id} className="bg-[var(--color-card-dark)] rounded-[var(--radius-md)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--color-text-secondary)] text-sm">
                      Set {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Reps Control */}
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleRepsChange(set.id, -1)}
                        className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center transition-transform hover:scale-105"
                        aria-label="Decrease reps"
                      >
                        <Minus size={18} color="white" />
                      </button>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-white">{set.reps}</span>
                        <span className="text-sm text-[var(--color-text-secondary)]">reps</span>
                      </div>
                      
                      <button 
                        onClick={() => handleRepsChange(set.id, 1)}
                        className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center transition-transform hover:scale-105"
                        aria-label="Increase reps"
                      >
                        <Plus size={18} color="white" />
                      </button>
                    </div>
                    
                    {/* Weight Control */}
                    <div className="flex flex-col items-center space-y-1 flex-1 ml-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-[var(--color-text-secondary)]">Weight</span>
                        <div className="flex items-baseline">
                          <span className="text-xl font-bold text-white mr-1">{set.weight}</span>
                          <span className="text-sm text-[var(--color-text-secondary)]">kg</span>
                        </div>
                      </div>
                      
                      <div className="w-full px-1">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="2.5"
                          value={set.weight}
                          onChange={(e) => handleWeightChange(set.id, parseInt(e.target.value))}
                          className="w-full slider"
                          aria-label="Weight slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Set Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={addSet}
                className="flex items-center justify-center px-4 py-2 rounded-full bg-white text-[var(--color-primary)] font-medium transition-transform hover:scale-105 shadow-md"
                aria-label="Add set"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Set</span>
              </button>
            </div>
          </main>

          {/* 3. Bottom Sheet with Exercise List */}
          <div className="absolute bottom-0 left-0 right-0 w-full bg-white rounded-t-[var(--radius-lg)] overflow-hidden z-20">
            <div className="max-h-[300px] overflow-y-auto p-4 exercise-list">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[var(--color-primary)] font-medium">Exercise List</h3>
                <span className="text-sm text-gray-500">
                  {exercises.findIndex(ex => ex.id === currentExerciseId) + 1} of {exercises.length}
                </span>
              </div>
              
              <div className="space-y-2">
                {exercises.map(exercise => (
                  <div
                    key={exercise.id}
                    onClick={() => changeExercise(exercise.id)}
                    className={`
                      p-4 rounded-[var(--radius-md)] cursor-pointer transition-all
                      ${exercise.id === currentExerciseId 
                        ? 'bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-yellow)] text-white font-medium shadow-md' 
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {exercise.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Pause Button */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[300px] transform translate-y-1/2 z-30">
            <button 
              onClick={() => setIsTimerActive(!isTimerActive)}
              className="w-16 h-16 rounded-full bg-[var(--color-yellow)] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              aria-label={isTimerActive ? "Pause workout" : "Resume workout"}
            >
              {isTimerActive ? (
                <Pause size={24} color="black" />
              ) : (
                <Play size={24} color="black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestWorkoutScreen;
