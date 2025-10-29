import React from 'react';

interface Exercise {
  id: string;
  name: string;
  sets: {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
  }[];
}

interface ExerciseListProps {
  exercises: Exercise[];
  currentExerciseId: string;
  onSelectExercise: (id: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises, 
  currentExerciseId, 
  onSelectExercise 
}) => {
  return (
    <div className="max-h-[300px] overflow-y-auto p-4">
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
            onClick={() => onSelectExercise(exercise.id)}
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
  );
};

export default ExerciseList;
