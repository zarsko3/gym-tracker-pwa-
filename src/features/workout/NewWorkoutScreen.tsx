import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Play, Pause } from 'lucide-react';

// Components
import Header from './components/Header';
import ExerciseTitle from './components/ExerciseTitle';
import RepsControl from './components/RepsControl';
import WeightSlider from './components/WeightSlider';
import AddSetButton from './components/AddSetButton';
import ExerciseList from './components/ExerciseList';
import PauseButton from './components/PauseButton';

// Types
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

const NewWorkoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams<{ workoutId: string }>();
  
  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
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
      name: 'Overhead Shoulder Press',
      sets: [{ id: '2-1', reps: 8, weight: 50, completed: false }]
    },
    {
      id: '3',
      name: 'Incline Dumbbell Press',
      sets: [{ id: '3-1', reps: 12, weight: 40, completed: false }]
    },
    {
      id: '4',
      name: 'Lateral Raises',
      sets: [{ id: '4-1', reps: 15, weight: 20, completed: false }]
    },
    {
      id: '5',
      name: 'Triceps Pushdowns',
      sets: [{ id: '5-1', reps: 12, weight: 35, completed: false }]
    }
  ]);
  
  // Current exercise state
  const [currentExerciseId, setCurrentExerciseId] = useState('1');
  const currentExercise = exercises.find(ex => ex.id === currentExerciseId) || exercises[0];

  // Timer effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle back button
  const handleBack = () => {
    navigate('/');
  };

  // Handle reps change
  const handleRepsChange = (setId: string, newReps: number) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => {
        if (ex.id === currentExerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId ? { ...set, reps: newReps } : set
            )
          };
        }
        return ex;
      })
    );
  };

  // Handle weight change
  const handleWeightChange = (setId: string, newWeight: number) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => {
        if (ex.id === currentExerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId ? { ...set, weight: newWeight } : set
            )
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
  };

  // Toggle pause/resume timer
  const toggleTimer = () => {
    setTimerRunning(prev => !prev);
  };

  // Change current exercise
  const changeExercise = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-primary)] p-4 flex items-center justify-center">
      <div className="w-full max-w-[428px] min-w-[390px] h-[844px] relative text-white font-sans overflow-hidden">
        {/* Header with back button and timer */}
        <Header 
          onBack={handleBack}
          time={formatTime(elapsedSeconds)}
          isTimerRunning={timerRunning}
        />
        
        {/* Main Content */}
        <main className="w-full h-full pt-24 px-6 flex flex-col">
          {/* Exercise Title */}
          <ExerciseTitle title={currentExercise.name} />
          
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
                  <RepsControl 
                    reps={set.reps}
                    onIncrease={() => handleRepsChange(set.id, set.reps + 1)}
                    onDecrease={() => handleRepsChange(set.id, Math.max(1, set.reps - 1))}
                  />
                  
                  {/* Weight Control */}
                  <WeightSlider 
                    weight={set.weight}
                    onChange={(value) => handleWeightChange(set.id, value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Set Button */}
          <AddSetButton onAddSet={addSet} />
        </main>
        
        {/* Bottom Exercise List */}
        <div className="absolute bottom-0 left-0 right-0 w-full bg-white rounded-t-[var(--radius-lg)] overflow-hidden z-20">
          <ExerciseList 
            exercises={exercises}
            currentExerciseId={currentExerciseId}
            onSelectExercise={changeExercise}
          />
        </div>
        
        {/* Pause Button */}
        <PauseButton 
          isRunning={timerRunning}
          onToggle={toggleTimer}
        />
      </div>
    </div>
  );
};

export default NewWorkoutScreen;
