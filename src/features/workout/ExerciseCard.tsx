import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, limit, getDocs, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Plus, Trash2, CheckCircle, Minus } from 'lucide-react';
import { debounce } from 'lodash-es';
import { queueWorkoutSave, isOnline } from '../../services/offlineQueue';
import { hapticLight, hapticSuccess, hapticSelection } from '../../utils/hapticFeedback';

interface Set {
  reps: number;
  weight: number;
  completed?: boolean;
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  workoutDate: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onUpdate, workoutDate }) => {
  const { user } = useAuth();
  const [lastWorkoutStats, setLastWorkoutStats] = useState<string>('Last: N/A');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    const findLastWorkout = async () => {
      try {
        const workoutsRef = collection(db, 'users', user.uid, 'workouts');
        const q = query(
          workoutsRef,
          where('date', '<', workoutDate),
          orderBy('date', 'desc'),
          limit(10)
        );

        const snapshot = await getDocs(q);
        
        for (const doc of snapshot.docs) {
          const workoutData = doc.data();
          if (workoutData.exercises && workoutData.exercises.length > 0) {
            const foundExercise = workoutData.exercises.find((e: any) => e.name === exercise.name);
            if (foundExercise && foundExercise.sets.length > 0) {
              const maxWeight = Math.max(...foundExercise.sets.map((set: Set) => set.weight || 0));
              const totalSets = foundExercise.sets.length;
              
              let exerciseVolume = 0;
              foundExercise.sets.forEach((set: Set) => {
                exerciseVolume += (set.reps || 0) * (set.weight || 0);
              });

              setLastWorkoutStats(
                `Last: ${totalSets} set${totalSets > 1 ? 's' : ''}, max ${maxWeight}kg, ${exerciseVolume.toLocaleString()}kg vol. on ${doc.id}`
              );
              return;
            }
          }
        }
        
        setLastWorkoutStats('Last: No previous data.');
      } catch (error) {
        console.error('Error finding last workout:', error);
        setLastWorkoutStats('Last: Error loading data.');
      }
    };

    findLastWorkout();
  }, [user, exercise.name, workoutDate]);

  const calculateVolume = () => {
    let totalVolume = 0;
    exercise.sets.forEach(set => {
      totalVolume += (set.reps || 0) * (set.weight || 0);
    });
    return totalVolume;
  };

  const addSet = () => {
    const newSets = [...exercise.sets, { reps: 0, weight: 0 }];
    onUpdate({ ...exercise, sets: newSets });
  };

  // Auto-save functionality
  const debouncedSave = useMemo(
    () => debounce(async (updatedSets: Set[]) => {
      if (!user) return;
      
      setSaving(true);
      try {
        const workoutRef = doc(db, 'users', user.uid, 'workouts', workoutDate);
        await setDoc(workoutRef, {
          date: workoutDate,
          workoutType: 'Push', // This should come from parent component
          templateId: 'ppl-default',
          exercises: [{ name: exercise.name, sets: updatedSets }]
        }, { merge: true });
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error auto-saving:', error);
        // Queue for offline sync if online save fails
        if (isOnline()) {
          queueWorkoutSave({
            date: workoutDate,
            workoutType: 'Push',
            templateId: 'ppl-default',
            exercises: [{ name: exercise.name, sets: updatedSets }],
            userId: user.uid
          });
        }
      } finally {
        setSaving(false);
      }
    }, 1000),
    [user, workoutDate, exercise.name]
  );

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = [...exercise.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onUpdate({ ...exercise, sets: newSets });
    debouncedSave(newSets);
  };

  const adjustWeight = (index: number, adjustment: number) => {
    hapticSelection();
    const newSets = [...exercise.sets];
    newSets[index] = { 
      ...newSets[index], 
      weight: Math.max(0, (newSets[index].weight || 0) + adjustment) 
    };
    onUpdate({ ...exercise, sets: newSets });
    debouncedSave(newSets);
  };

  const adjustReps = (index: number, adjustment: number) => {
    hapticSelection();
    const newSets = [...exercise.sets];
    newSets[index] = { 
      ...newSets[index], 
      reps: Math.max(0, (newSets[index].reps || 0) + adjustment) 
    };
    onUpdate({ ...exercise, sets: newSets });
    debouncedSave(newSets);
  };

  const markSetComplete = (index: number) => {
    const newSets = [...exercise.sets];
    const wasCompleted = newSets[index].completed;
    newSets[index] = { ...newSets[index], completed: !wasCompleted };
    
    if (!wasCompleted) {
      hapticSuccess(); // Success feedback when completing a set
    } else {
      hapticLight(); // Light feedback when uncompleting
    }
    
    onUpdate({ ...exercise, sets: newSets });
    debouncedSave(newSets);
  };

  const removeSet = (index: number) => {
    const newSets = exercise.sets.filter((_, i) => i !== index);
    onUpdate({ ...exercise, sets: newSets });
  };

  return (
    <div className="bg-gray-700 rounded-lg p-3 sm:p-4 shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white">{exercise.name}</h4>
          <p className="text-xs sm:text-sm text-indigo-300 -mt-1">
            Vol: {calculateVolume().toLocaleString()}kg
            {saving && <span className="ml-2 text-yellow-400">Saving...</span>}
            {lastSaved && !saving && (
              <span className="ml-2 text-green-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={addSet}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all btn-ios"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Set
        </button>
      </div>
      
      <p className="text-xs sm:text-sm text-indigo-300 mb-3">{lastWorkoutStats}</p>
      
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Set {index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markSetComplete(index)}
                  className={`btn-ios-stepper rounded-full w-12 h-12 sm:w-11 sm:h-11 ${
                    set.completed 
                      ? 'set-complete' 
                      : 'set-incomplete'
                  }`}
                  aria-label={set.completed ? 'Mark set as incomplete' : 'Mark set as complete'}
                >
                  {set.completed ? <CheckCircle className="w-5 h-5" /> : '○'}
                </button>
                <button
                  onClick={() => removeSet(index)}
                  className="text-gray-400 hover:text-red-500 transition-all p-1 btn-ios-stepper w-12 h-12 sm:w-11 sm:h-11"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Weight Input */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weight (kg)</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustWeight(index, -5)}
                    className="btn-ios-stepper w-12 h-12 sm:w-11 sm:h-11"
                    aria-label="Decrease weight by 5kg"
                  >
                    -5
                  </button>
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                    className="input-ios flex-1 text-xl sm:text-lg h-12 sm:h-11"
                    placeholder="0"
                    inputMode="numeric"
                    aria-label="Weight in kilograms"
                  />
                  <button
                    onClick={() => adjustWeight(index, 5)}
                    className="btn-ios-stepper w-12 h-12 sm:w-11 sm:h-11"
                    aria-label="Increase weight by 5kg"
                  >
                    +5
                  </button>
                </div>
              </div>
              
              {/* Reps Input */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Reps</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustReps(index, -1)}
                    className="btn-ios-stepper w-12 h-12 sm:w-11 sm:h-11"
                    aria-label="Decrease reps by 1"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                    className="input-ios flex-1 text-xl sm:text-lg h-12 sm:h-11"
                    placeholder="0"
                    inputMode="numeric"
                    aria-label="Number of repetitions"
                  />
                  <button
                    onClick={() => adjustReps(index, 1)}
                    className="btn-ios-stepper w-12 h-12 sm:w-11 sm:h-11"
                    aria-label="Increase reps by 1"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;
