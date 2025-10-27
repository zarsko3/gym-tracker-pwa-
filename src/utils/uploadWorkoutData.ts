import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

// Sample workout data from your CSV
const workoutData = [
  {
    date: '2025-09-08',
    workoutType: 'Push',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Overhead Shoulder Press',
        sets: [
          { reps: 0, weight: 16, completed: true, equipment: 'Dumbbells', notes: '16 kg per dumbbell' }
        ]
      }
    ]
  },
  {
    date: '2025-09-10',
    workoutType: 'Legs',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Back Squat',
        sets: [
          { reps: 0, weight: 40, completed: true, equipment: 'Olympic Barbell', notes: '20 kg per side (bar not specified)' }
        ]
      },
      {
        name: 'Lunges',
        sets: [
          { reps: 0, weight: 30, completed: true, equipment: 'Smith Machine', notes: '15 kg per side' }
        ]
      },
      {
        name: 'Machine Squat / Leg Press',
        sets: [
          { reps: 0, weight: 100, completed: true, equipment: 'Machine', notes: 'Machine squat listed as 100 kg' }
        ]
      },
      {
        name: 'Standing Calf Raises',
        sets: [
          { reps: 0, weight: 40, completed: true, equipment: 'Smith Machine', notes: '20 kg per side' }
        ]
      }
    ]
  },
  {
    date: '2025-09-11',
    workoutType: 'Push',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Overhead Shoulder Press',
        sets: [
          { reps: 0, weight: 50, completed: true, equipment: 'Machine', notes: '25 kg per side on the machine' }
        ]
      }
    ]
  },
  {
    date: '2025-09-17',
    workoutType: 'Pull',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Face Pulls',
        sets: [
          { reps: 0, weight: 25, completed: true, equipment: 'Cable', notes: 'Went up to 25 kg' }
        ]
      }
    ]
  },
  {
    date: '2025-09-25',
    workoutType: 'Pull',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Vertical Traction',
        sets: [
          { reps: 0, weight: 60, completed: true, equipment: 'Machine', notes: '3 sets at 60 kg' }
        ]
      }
    ]
  },
  {
    date: '2025-09-28',
    workoutType: 'Push',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Chest Press',
        sets: [
          { reps: 0, weight: 60, completed: true, equipment: 'Machine', notes: 'Went up to 60 kg' }
        ]
      },
      {
        name: 'Incline Dumbbell Press',
        sets: [
          { reps: 0, weight: 18, completed: true, equipment: 'Dumbbells', notes: 'Went up to 18 kg per dumbbell' }
        ]
      },
      {
        name: 'Lateral Raises',
        sets: [
          { reps: 0, weight: 8, completed: true, equipment: 'Dumbbells', notes: 'Went up to 8 kg per dumbbell' }
        ]
      }
    ]
  },
  {
    date: '2025-10-19',
    workoutType: 'Legs',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Leg Curl',
        sets: [
          { reps: 0, weight: 35, completed: true, equipment: 'Machine', notes: '' }
        ]
      },
      {
        name: 'Leg Extension',
        sets: [
          { reps: 0, weight: 35, completed: true, equipment: 'Machine', notes: 'Confirmed constant warm-up/isolation' }
        ]
      },
      {
        name: 'Romanian Deadlift',
        sets: [
          { reps: 0, weight: 50, completed: true, equipment: 'Olympic Barbell', notes: '25 kg per side (plus bar weight not specified)' }
        ]
      }
    ]
  },
  {
    date: '2025-10-21',
    workoutType: 'Pull',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Lat Pulldown',
        sets: [
          { reps: 0, weight: 60, completed: true, equipment: 'Cable/Machine', notes: 'Went up to 60 kg' }
        ]
      }
    ]
  },
  {
    date: '2025-10-23',
    workoutType: 'Legs',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Leg Press',
        sets: [
          { reps: 0, weight: 100, completed: true, equipment: 'Machine', notes: 'Machine leg press 100 kg' }
        ]
      },
      {
        name: 'Standing Calf Raises',
        sets: [
          { reps: 0, weight: 37.5, completed: true, equipment: 'Smith Machine', notes: '37.5 kg per side' }
        ]
      }
    ]
  },
  {
    date: '2025-10-26',
    workoutType: 'Push',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Incline Dumbbell Press',
        sets: [
          { reps: 0, weight: 20, completed: true, equipment: 'Dumbbells', notes: 'Went up to 20 kg per dumbbell' }
        ]
      }
    ]
  },
  {
    date: '2025-10-27',
    workoutType: 'Pull',
    templateId: 'ppl-default',
    exercises: [
      {
        name: 'Face Pulls',
        sets: [
          { reps: 0, weight: 20, completed: true, equipment: 'Cable', notes: "Logged 'Face Pulls 20 kg'" }
        ]
      }
    ]
  }
];

export const uploadWorkoutData = async (userId: string) => {
  try {
    console.log(`🚀 Uploading workout data for user: ${userId}`);
    
    const uploadPromises = workoutData.map(async (workout) => {
      try {
        const workoutRef = doc(db, 'users', userId, 'workouts', workout.date);
        await setDoc(workoutRef, workout);
        console.log(`✅ Uploaded workout for ${workout.date}: ${workout.workoutType} (${workout.exercises.length} exercises)`);
      } catch (error) {
        console.error(`❌ Error uploading workout for ${workout.date}:`, error);
      }
    });
    
    await Promise.all(uploadPromises);
    console.log(`🎉 Upload complete! Processed ${workoutData.length} workout days`);
    
    return { success: true, count: workoutData.length };
    } catch (error) {
      console.error('❌ Error during upload process:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
};

export const getWorkoutStats = () => {
  const stats = {
    totalDays: workoutData.length,
    byType: {} as Record<string, number>,
    totalExercises: 0,
    totalSets: 0
  };
  
  workoutData.forEach(workout => {
    stats.byType[workout.workoutType] = (stats.byType[workout.workoutType] || 0) + 1;
    stats.totalExercises += workout.exercises.length;
    stats.totalSets += workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  });
  
  return stats;
};
