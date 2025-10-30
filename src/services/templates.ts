// Default workout templates
export const DEFAULT_TEMPLATES = {
  'ppl-default': {
    id: 'ppl-default',
    name: 'Push Pull Legs',
    description: 'Classic 3-day split focusing on push, pull, and leg movements',
    workouts: {
      Push: [
        'Bench Press or Dumbbell Press',
        'Overhead Shoulder Press',
        'Incline Dumbbell Press',
        'Lateral Raises',
        'Triceps Pushdowns',
        'Skull Crushers or Dips'
      ],
      Pull: [
        'Pull-Ups or Lat Pulldown',
        'Barbell Row or Dumbbell Row',
        'Face Pulls',
        'Dumbbell Shrugs',
        'Cable Bicep Curls',
        'Hammer Curls'
      ],
      Legs: [
        'Squats or Leg Press',
        'Romanian Deadlift',
        'Lunges or Bulgarian Split Squat',
        'Leg Curl Machine',
        'Standing Calf Raises',
        'Plank or Hanging Leg Raises'
      ]
    }
  },
  'ppl-detailed': {
    id: 'ppl-detailed',
    name: 'PPL Detailed',
    description: 'Comprehensive PPL program with detailed exercise breakdown',
    workouts: {
      Push: [
        'Bench Press or Dumbbell Press',
        'Overhead Shoulder Press',
        'Incline Dumbbell Press',
        'Lateral Raises',
        'Triceps Pushdowns',
        'Skull Crushers or Dips'
      ],
      Pull: [
        'Pull-Ups or Lat Pulldown',
        'Barbell Row or Dumbbell Row',
        'Face Pulls',
        'Dumbbell Shrugs',
        'Cable Bicep Curls',
        'Hammer Curls'
      ],
      Legs: [
        'Squats or Leg Press',
        'Romanian Deadlift',
        'Lunges or Bulgarian Split Squat',
        'Leg Curl Machine',
        'Standing Calf Raises',
        'Plank or Hanging Leg Raises'
      ]
    }
  },
  'upper-lower': {
    id: 'upper-lower',
    name: 'Upper Lower Split',
    description: '4-day split alternating between upper and lower body workouts',
    workouts: {
      'Upper 1': [
        'Bench Press',
        'Pull-Ups',
        'Overhead Press',
        'Barbell Rows',
        'Dips',
        'Bicep Curls'
      ],
      'Lower 1': [
        'Squats',
        'Romanian Deadlift',
        'Leg Press',
        'Leg Curls',
        'Calf Raises',
        'Plank'
      ],
      'Upper 2': [
        'Incline Press',
        'Lat Pulldown',
        'Lateral Raises',
        'Cable Rows',
        'Tricep Extensions',
        'Hammer Curls'
      ],
      'Lower 2': [
        'Deadlifts',
        'Front Squats',
        'Bulgarian Split Squats',
        'Leg Extensions',
        'Seated Calf Raises',
        'Hanging Leg Raises'
      ]
    }
  },
  'full-body': {
    id: 'full-body',
    name: 'Full Body',
    description: 'Complete body workout in each session',
    workouts: {
      'Full Body': [
        'Squats',
        'Bench Press',
        'Bent-Over Rows',
        'Overhead Press',
        'Deadlifts',
        'Pull-Ups or Lat Pulldown',
        'Plank'
      ]
    }
  }
};

export const KEY_LIFTS = [
  'Bench Press or Dumbbell Press',
  'Overhead Shoulder Press',
  'Pull-Ups or Lat Pulldown',
  'Barbell Row or Dumbbell Row',
  'Squats or Leg Press',
  'Romanian Deadlift'
];

export type WorkoutTemplate = {
  id: string;
  name: string;
  description: string;
  workouts: Record<string, string[]>;
};

export interface ExerciseCategory {
  id: string;
  name: string;
  muscleGroups: string[];
  icon: string;
}

export const EXERCISE_CATEGORIES: Record<string, ExerciseCategory> = {
  chest: {
    id: 'chest',
    name: 'Chest',
    muscleGroups: ['Pectorals'],
    icon: 'dumbbell'
  },
  back: {
    id: 'back',
    name: 'Back',
    muscleGroups: ['Lats', 'Rhomboids', 'Traps'],
    icon: 'trending-up'
  },
  shoulders: {
    id: 'shoulders',
    name: 'Shoulders',
    muscleGroups: ['Deltoids'],
    icon: 'activity'
  },
  arms: {
    id: 'arms',
    name: 'Arms',
    muscleGroups: ['Biceps', 'Triceps'],
    icon: 'zap'
  },
  legs: {
    id: 'legs',
    name: 'Legs',
    muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    icon: 'activity'
  },
  warmup: {
    id: 'warmup',
    name: 'Warm-up',
    muscleGroups: ['General'],
    icon: 'flame'
  }
};

// Map exercises to categories
export const EXERCISE_TO_CATEGORY: Record<string, string> = {
  'Bench Press or Dumbbell Press': 'chest',
  'Incline Dumbbell Press': 'chest',
  'Overhead Shoulder Press': 'shoulders',
  'Lateral Raises': 'shoulders',
  'Triceps Pushdowns': 'arms',
  'Skull Crushers or Dips': 'arms',
  'Pull-Ups or Lat Pulldown': 'back',
  'Barbell Row or Dumbbell Row': 'back',
  'Face Pulls': 'shoulders',
  'Cable Bicep Curls': 'arms',
  'Hammer Curls': 'arms',
  'Squats or Leg Press': 'legs',
  'Romanian Deadlift': 'legs',
  'Lunges or Bulgarian Split Squat': 'legs',
  'Leg Curl Machine': 'legs',
  'Standing Calf Raises': 'legs',
  'Plank or Hanging Leg Raises': 'legs'
};

export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Rest' | string;

// Detailed exercise data with sets, reps, and weight recommendations
export interface ExerciseData {
  name: string;
  category: string;
  muscleGroups: string[];
  sets: number;
  reps: string;
  weight: {
    min: number;
    max: number;
    increment: number;
  };
  restTime: number; // in seconds
  notes?: string;
}

export const PPL_EXERCISES: Record<string, ExerciseData[]> = {
  Push: [
    {
      name: 'Bench Press or Dumbbell Press',
      category: 'chest',
      muscleGroups: ['Pectorals', 'Anterior Deltoids', 'Triceps'],
      sets: 4,
      reps: '8-12',
      weight: { min: 20, max: 150, increment: 2.5 },
      restTime: 120,
      notes: 'Focus on controlled movement and full range of motion'
    },
    {
      name: 'Overhead Shoulder Press',
      category: 'shoulders',
      muscleGroups: ['Anterior Deltoids', 'Medial Deltoids', 'Triceps'],
      sets: 3,
      reps: '8-12',
      weight: { min: 10, max: 80, increment: 2.5 },
      restTime: 90,
      notes: 'Keep core tight and press straight up'
    },
    {
      name: 'Incline Dumbbell Press',
      category: 'chest',
      muscleGroups: ['Upper Pectorals', 'Anterior Deltoids'],
      sets: 3,
      reps: '10-15',
      weight: { min: 15, max: 60, increment: 2.5 },
      restTime: 90,
      notes: '30-45 degree incline, focus on upper chest'
    },
    {
      name: 'Lateral Raises',
      category: 'shoulders',
      muscleGroups: ['Medial Deltoids'],
      sets: 3,
      reps: '12-20',
      weight: { min: 5, max: 25, increment: 2.5 },
      restTime: 60,
      notes: 'Light weight, controlled movement, slight forward lean'
    },
    {
      name: 'Triceps Pushdowns',
      category: 'arms',
      muscleGroups: ['Triceps'],
      sets: 3,
      reps: '12-15',
      weight: { min: 20, max: 80, increment: 5 },
      restTime: 60,
      notes: 'Keep elbows pinned to sides, full extension'
    },
    {
      name: 'Skull Crushers or Dips',
      category: 'arms',
      muscleGroups: ['Triceps'],
      sets: 3,
      reps: '8-12',
      weight: { min: 0, max: 50, increment: 2.5 },
      restTime: 60,
      notes: 'Body weight for dips, or weighted skull crushers'
    }
  ],
  Pull: [
    {
      name: 'Pull-Ups or Lat Pulldown',
      category: 'back',
      muscleGroups: ['Latissimus Dorsi', 'Rhomboids', 'Middle Traps'],
      sets: 4,
      reps: '6-12',
      weight: { min: 0, max: 100, increment: 5 },
      restTime: 120,
      notes: 'Full range of motion, controlled negative'
    },
    {
      name: 'Barbell Row or Dumbbell Row',
      category: 'back',
      muscleGroups: ['Latissimus Dorsi', 'Rhomboids', 'Posterior Deltoids'],
      sets: 4,
      reps: '8-12',
      weight: { min: 20, max: 120, increment: 2.5 },
      restTime: 120,
      notes: 'Pull to lower chest, squeeze shoulder blades'
    },
    {
      name: 'Face Pulls',
      category: 'shoulders',
      muscleGroups: ['Posterior Deltoids', 'Rhomboids', 'Middle Traps'],
      sets: 3,
      reps: '15-20',
      weight: { min: 10, max: 40, increment: 2.5 },
      restTime: 60,
      notes: 'External rotation at the top, pull to face level'
    },
    {
      name: 'Dumbbell Shrugs',
      category: 'back',
      muscleGroups: ['Upper Traps'],
      sets: 3,
      reps: '12-15',
      weight: { min: 20, max: 80, increment: 5 },
      restTime: 60,
      notes: 'Squeeze at the top, controlled movement'
    },
    {
      name: 'Cable Bicep Curls',
      category: 'arms',
      muscleGroups: ['Biceps'],
      sets: 3,
      reps: '10-15',
      weight: { min: 10, max: 50, increment: 2.5 },
      restTime: 60,
      notes: 'Keep elbows stationary, full range of motion'
    },
    {
      name: 'Hammer Curls',
      category: 'arms',
      muscleGroups: ['Biceps', 'Brachialis'],
      sets: 3,
      reps: '10-15',
      weight: { min: 10, max: 40, increment: 2.5 },
      restTime: 60,
      notes: 'Neutral grip, focus on the squeeze'
    }
  ],
  Legs: [
    {
      name: 'Squats or Leg Press',
      category: 'legs',
      muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
      sets: 4,
      reps: '8-12',
      weight: { min: 40, max: 200, increment: 5 },
      restTime: 180,
      notes: 'Full depth, knees tracking over toes'
    },
    {
      name: 'Romanian Deadlift',
      category: 'legs',
      muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
      sets: 4,
      reps: '8-12',
      weight: { min: 40, max: 150, increment: 5 },
      restTime: 180,
      notes: 'Hip hinge movement, keep back straight'
    },
    {
      name: 'Lunges or Bulgarian Split Squat',
      category: 'legs',
      muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
      sets: 3,
      reps: '10-12 each leg',
      weight: { min: 0, max: 40, increment: 2.5 },
      restTime: 90,
      notes: 'Controlled movement, full range of motion'
    },
    {
      name: 'Leg Curl Machine',
      category: 'legs',
      muscleGroups: ['Hamstrings'],
      sets: 3,
      reps: '12-15',
      weight: { min: 20, max: 100, increment: 5 },
      restTime: 60,
      notes: 'Squeeze at the top, controlled negative'
    },
    {
      name: 'Standing Calf Raises',
      category: 'legs',
      muscleGroups: ['Calves'],
      sets: 4,
      reps: '15-20',
      weight: { min: 0, max: 50, increment: 5 },
      restTime: 45,
      notes: 'Full range of motion, pause at the top'
    },
    {
      name: 'Plank or Hanging Leg Raises',
      category: 'core',
      muscleGroups: ['Core', 'Lower Abs'],
      sets: 3,
      reps: '30-60 seconds or 10-15 reps',
      weight: { min: 0, max: 0, increment: 0 },
      restTime: 60,
      notes: 'Hold plank position or controlled leg raises'
    }
  ]
};

// Get exercises for a specific workout type
export function getExercisesForWorkout(workoutType: string): ExerciseData[] {
  // Handle case-insensitive matching
  const normalizedType = workoutType.charAt(0).toUpperCase() + workoutType.slice(1).toLowerCase();
  console.log('Looking for workout type:', workoutType, 'normalized to:', normalizedType);
  console.log('Available types:', Object.keys(PPL_EXERCISES));
  return PPL_EXERCISES[normalizedType] || [];
}

// Get all available workout types
export function getAvailableWorkoutTypes(): string[] {
  return Object.keys(PPL_EXERCISES);
}
