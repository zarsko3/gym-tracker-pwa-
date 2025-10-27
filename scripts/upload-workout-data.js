import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';
import csv from 'csv-parser';

// Firebase configuration (using your production config)
const firebaseConfig = {
  apiKey: "AIzaSyCWIFSIob0GB3jtopGjNTClFVzpRJnMXZo",
  authDomain: "gym-tracker0pwa.firebaseapp.com",
  projectId: "gym-tracker0pwa",
  storageBucket: "gym-tracker0pwa.firebasestorage.app",
  messagingSenderId: "61186173345",
  appId: "1:61186173345:web:481eb9a25be64fe6de03e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to parse CSV data
function parseCSVData(csvPath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Clean and validate the data
        if (data.date && data.day_type && data.exercise) {
          results.push({
            date: data.date.trim(),
            day_type: data.day_type.trim(),
            exercise: data.exercise.trim(),
            equipment: data.equipment?.trim() || '',
            sets: data.sets ? parseFloat(data.sets) : 1,
            reps: data.reps ? parseInt(data.reps) : 0,
            weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : 0,
            notes: data.notes?.trim() || ''
          });
        }
      })
      .on('end', () => {
        console.log(`Parsed ${results.length} workout entries from CSV`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// Function to group exercises by date and workout type
function groupWorkoutsByDate(workoutData) {
  const grouped = {};
  
  workoutData.forEach(workout => {
    const { date, day_type, exercise, equipment, sets, reps, weight_kg, notes } = workout;
    
    if (!grouped[date]) {
      grouped[date] = {
        date,
        workoutType: day_type,
        templateId: 'ppl-default',
        exercises: []
      };
    }
    
    // Find existing exercise or create new one
    let exerciseIndex = grouped[date].exercises.findIndex(ex => ex.name === exercise);
    
    if (exerciseIndex === -1) {
      // Create new exercise
      grouped[date].exercises.push({
        name: exercise,
        sets: []
      });
      exerciseIndex = grouped[date].exercises.length - 1;
    }
    
    // Add set data
    const setData = {
      reps: reps || 0,
      weight: weight_kg || 0,
      completed: true // All historical data is completed
    };
    
    // Add equipment and notes as metadata if needed
    if (equipment || notes) {
      setData.equipment = equipment;
      setData.notes = notes;
    }
    
    grouped[date].exercises[exerciseIndex].sets.push(setData);
  });
  
  return grouped;
}

// Function to upload workouts to Firestore
async function uploadWorkoutsToFirestore(workouts, userId) {
  console.log(`Uploading workouts for user: ${userId}`);
  
  const uploadPromises = Object.entries(workouts).map(async ([date, workoutData]) => {
    try {
      const workoutRef = doc(db, 'users', userId, 'workouts', date);
      await setDoc(workoutRef, workoutData);
      console.log(`✅ Uploaded workout for ${date}: ${workoutData.workoutType} (${workoutData.exercises.length} exercises)`);
    } catch (error) {
      console.error(`❌ Error uploading workout for ${date}:`, error);
    }
  });
  
  await Promise.all(uploadPromises);
  console.log(`🎉 Upload complete! Processed ${Object.keys(workouts).length} workout days`);
}

// Function to get existing users
async function getExistingUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting workout data upload...');
    
    // Parse CSV data
    const csvPath = 'c:\\Users\\galz\\Downloads\\PPL_Workout_Log__Sep_8_Oct_27__2025_.csv';
    const workoutData = await parseCSVData(csvPath);
    
    // Group workouts by date
    const groupedWorkouts = groupWorkoutsByDate(workoutData);
    
    console.log('📊 Workout summary:');
    Object.entries(groupedWorkouts).forEach(([date, workout]) => {
      const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
      console.log(`  ${date}: ${workout.workoutType} - ${workout.exercises.length} exercises, ${totalSets} sets`);
    });
    
    // Get existing users
    const users = await getExistingUsers();
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database. Please create a user account first.');
      return;
    }
    
    // For now, upload to the first user (you can modify this logic)
    const targetUserId = users[0].id;
    console.log(`📤 Uploading to user: ${targetUserId}`);
    
    // Upload workouts
    await uploadWorkoutsToFirestore(groupedWorkouts, targetUserId);
    
    console.log('✅ Upload process completed successfully!');
    console.log('🔄 The app should now show your historical workout data.');
    
  } catch (error) {
    console.error('❌ Error during upload process:', error);
  }
}

// Run the script
main();
