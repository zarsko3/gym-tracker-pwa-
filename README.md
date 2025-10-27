# Gym Tracker PWA

A Progressive Web App for tracking gym workouts with a focus on mobile optimization and offline capabilities.

## Features

- 📱 **Mobile-First Design** - Optimized for iOS and Android
- 🔐 **Authentication** - Email/password and Google sign-in
- 📅 **Calendar View** - Weekly workout calendar with visual indicators
- 📊 **Progress Tracking** - Charts and analytics for exercise progression
- 🏋️ **Workout Logging** - Easy set/rep/weight tracking with volume calculation
- 📋 **Templates** - Pre-built and custom workout programs
- 🔄 **Real-time Sync** - Firebase Firestore integration
- 📱 **PWA** - Installable on mobile devices
- 🌐 **Offline Support** - Works without internet connection

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Charts**: Chart.js + React-Chartjs-2
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin + Workbox

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### 2. Clone and Install

```bash
git clone <repository-url>
cd gym-tracker-pwa
npm install
```

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Enable Firestore Database
4. Copy your Firebase config

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Feature-specific modules
│   ├── auth/          # Authentication pages
│   ├── calendar/      # Calendar and dashboard
│   ├── workout/       # Workout logging
│   ├── progress/      # Progress tracking
│   └── templates/     # Workout templates
├── context/           # React context providers
├── services/          # Firebase and API services
├── utils/             # Helper functions
└── App.tsx           # Main app component
```

## Default Workout Templates

The app comes with pre-built templates:

- **Push Pull Legs (PPL)** - Classic 3-day split
- **Upper Lower** - 4-day split
- **Full Body** - Complete body workout

Users can create and save custom templates.

## Mobile Optimization

- Touch-optimized buttons (44x44px minimum)
- Swipe gestures for calendar navigation
- Pull-to-refresh functionality
- Safe area insets for iOS
- Prevent zoom on input focus
- Responsive design for all screen sizes

## PWA Features

- Installable on iOS and Android
- Offline functionality with service worker
- Background sync for workout data
- App-like experience with standalone display
- Custom app icons and splash screens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

MIT License - see LICENSE file for details
