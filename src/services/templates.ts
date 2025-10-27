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

export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Rest' | string;
