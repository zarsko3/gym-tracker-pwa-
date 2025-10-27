import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface Set {
  reps: number;
  weight: number;
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

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const newSets = [...exercise.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onUpdate({ ...exercise, sets: newSets });
  };

  const removeSet = (index: number) => {
    const newSets = exercise.sets.filter((_, i) => i !== index);
    onUpdate({ ...exercise, sets: newSets });
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{exercise.name}</h4>
          <p className="text-sm text-indigo-300 -mt-1">
            Vol: {calculateVolume().toLocaleString()}kg
          </p>
        </div>
        <button
          onClick={addSet}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Set
        </button>
      </div>
      
      <p className="text-sm text-indigo-300 mb-3">{lastWorkoutStats}</p>
      
      <div className="space-y-2">
        {exercise.sets.map((set, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-8 text-sm font-medium text-gray-400">Set {index + 1}</span>
            <input
              type="number"
              placeholder="Reps"
              value={set.reps || ''}
              onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
              className="reps-input w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={set.weight || ''}
              onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
              className="weight-input w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => removeSet(index)}
              className="text-gray-400 hover:text-red-500 transition-all p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;
