const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc, writeBatch } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  // Use production config
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCWIFSIob0GB3jtopGjNTClFVzpRJnMXZo",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gym-tracker0pwa.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gym-tracker0pwa",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gym-tracker0pwa.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61186173345",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:61186173345:web:481eb9a25be64fe6de03e0",
  measurementId: "G-WG6QCBERJ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllWorkouts(dryRun = true) {
  console.log(`🔍 ${dryRun ? 'DRY RUN - No data will be deleted' : 'DELETING WORKOUTS'}`);
  
  // Step 1: Get all users
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`📊 Found ${users.length} users`);
  
  let totalWorkouts = 0;
  const backupData = [];
  
  // Step 2: For each user, get and delete their workouts
  for (const user of users) {
    const workoutsRef = collection(db, 'users', user.id, 'workouts');
    const workoutsSnapshot = await getDocs(workoutsRef);
    
    console.log(`  User ${user.id}: ${workoutsSnapshot.size} workouts`);
    totalWorkouts += workoutsSnapshot.size;
    
    // Backup workout data
    workoutsSnapshot.docs.forEach(doc => {
      backupData.push({
        userId: user.id,
        workoutId: doc.id,
        data: doc.data()
      });
    });
    
    if (!dryRun) {
      // Delete in batches of 500 (Firestore limit)
      const batches = [];
      let batch = writeBatch(db);
      let batchCount = 0;
      
      workoutsSnapshot.docs.forEach((workoutDoc) => {
        batch.delete(workoutDoc.ref);
        batchCount++;
        
        if (batchCount === 500) {
          batches.push(batch.commit());
          batch = writeBatch(db);
          batchCount = 0;
        }
      });
      
      if (batchCount > 0) {
        batches.push(batch.commit());
      }
      
      await Promise.all(batches);
      console.log(`  ✅ Deleted ${workoutsSnapshot.size} workouts`);
    }
  }
  
  // Save backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup-workouts-${timestamp}.json`;
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  console.log(`💾 Backup saved to ${backupFile}`);
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total users: ${users.length}`);
  console.log(`   Total workouts: ${totalWorkouts}`);
  console.log(`   Status: ${dryRun ? 'DRY RUN - No changes made' : 'DELETED'}`);
  
  return { users: users.length, workouts: totalWorkouts };
}

// Run with --execute flag to actually delete
const isDryRun = !process.argv.includes('--execute');
deleteAllWorkouts(isDryRun)
  .then(() => {
    console.log('\n✅ Complete!');
    if (isDryRun) {
      console.log('💡 Run with --execute flag to actually delete: node scripts/delete-workouts.cjs --execute');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
