# Deployment Guide

## GitHub Setup

1. Create a new repository on GitHub:
   - Name: `gym-tracker-pwa`
   - Description: "A Progressive Web App for tracking gym workouts"
   - Make it **Public**
   - Don't initialize with README, .gitignore, or license

2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gym-tracker-pwa.git
   git push -u origin main
   ```

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `gym-tracker-pwa` repository
4. Configure environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click "Deploy"

### Option 2: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
3. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (already included in `firestore.rules`)
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" > Web
   - Copy the config values

## Environment Variables

Create a `.env.local` file with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Testing

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Build Test**:
   ```bash
   npm run build
   npm run preview
   ```

3. **PWA Testing**:
   - Open in Chrome/Edge
   - Check "Application" tab > "Manifest"
   - Test "Add to Home Screen" functionality

## Mobile Testing

1. **iOS Safari**:
   - Open the deployed URL
   - Tap Share > Add to Home Screen
   - Test offline functionality

2. **Android Chrome**:
   - Open the deployed URL
   - Tap menu > "Add to Home screen"
   - Test offline functionality

## Troubleshooting

- **Build Errors**: Check TypeScript errors with `npm run build`
- **Firebase Errors**: Verify environment variables are set correctly
- **PWA Issues**: Check manifest.json and service worker in browser dev tools
- **Mobile Issues**: Test on actual devices, not just browser dev tools
