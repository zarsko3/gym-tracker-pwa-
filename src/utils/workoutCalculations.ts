export interface Exercise {
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    completed?: boolean;
  }>;
}

export interface WorkoutData {
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Exercise[];
}

export const calculateTotalVolume = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + (set.reps * set.weight);
    }, 0);
  }, 0);
};

export const calculateExerciseVolume = (exercise: Exercise): number => {
  return exercise.sets.reduce((total, set) => {
    return total + (set.reps * set.weight);
  }, 0);
};

export const calculate1RM = (weight: number, reps: number): number => {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  
  // Epley formula: 1RM = weight * (1 + reps/30)
  return Math.round(weight * (1 + reps / 30));
};

export const calculateProgressPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const calculateSetsCompleted = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter(set => set.completed).length;
  }, 0);
};

export const calculateTotalSets = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
};

export const getMuscleGroup = (workoutType: string): string => {
  const groups: Record<string, string> = {
    'Push': 'Chest, Shoulders, Triceps',
    'Pull': 'Back, Biceps',
    'Legs': 'Quads, Hamstrings, Glutes, Calves',
    'Rest': 'Recovery'
  };
  return groups[workoutType] || 'Unknown';
};

export const formatWeight = (weight: number): string => {
  if (weight === 0) return '0';
  if (weight < 1) return weight.toFixed(1);
  return Math.round(weight).toString();
};

export const formatVolume = (volume: number): string => {
  if (volume === 0) return '0 kg';
  if (volume < 1000) return `${Math.round(volume)} kg`;
  return `${(volume / 1000).toFixed(1)}k kg`;
};

export const getWorkoutIntensity = (exercises: Exercise[]): 'Low' | 'Medium' | 'High' => {
  const totalVolume = calculateTotalVolume(exercises);
  const totalSets = calculateTotalSets(exercises);
  
  if (totalSets === 0) return 'Low';
  
  const avgVolumePerSet = totalVolume / totalSets;
  
  if (avgVolumePerSet < 100) return 'Low';
  if (avgVolumePerSet < 200) return 'Medium';
  return 'High';
};
