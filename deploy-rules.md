# Deploy Firestore Rules

## Option 1: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `gym-tracker0pwa`
3. Go to **Firestore Database** > **Rules**
4. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Workouts subcollection
      match /workouts/{workoutId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Templates are readable by all authenticated users, writable by their creators
    match /templates/{templateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         !exists(/databases/$(database)/documents/templates/$(templateId)));
    }
  }
}
```

5. Click **Publish**

## Option 2: Using Firebase CLI

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy rules: `firebase deploy --only firestore:rules`

## Option 3: Temporary Testing Rules

If you want to test quickly, use these temporary rules (less secure):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary rule for testing - allows all authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** Replace with proper rules after testing!
