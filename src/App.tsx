import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Splash & Onboarding
import Splash1 from './features/onboarding/Splash1';
import Splash2 from './features/onboarding/Splash2';
import Splash3 from './features/onboarding/Splash3';
import OnboardingSplash from './features/onboarding/OnboardingSplash';
import Step1Weight from './features/onboarding/Step1Weight';
import Step2Height from './features/onboarding/Step2Height';

// Auth Flow
import Welcome from './features/auth/Welcome';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import OTPVerification from './features/auth/OTPVerification';
import PasswordChanged from './features/auth/PasswordChanged';
import Settings from './features/auth/Settings';

// Main App
import Dashboard from './features/calendar/Dashboard';
import Schedule from './features/calendar/Schedule';
import Statistics from './features/progress/Statistics';
import WorkoutLogger from './features/workout/WorkoutLogger';
import WorkoutScreen from './features/workout/WorkoutScreen';
import WorkoutSuccess from './features/workout/WorkoutSuccess';
import Progress from './features/progress/Progress';
import Templates from './features/templates/Templates';
import Profile from './features/auth/Profile';
import DataUpload from './features/admin/DataUpload';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check:', { user: !!user, loading });

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app bg-[var(--color-primary)] text-white">
          <Routes>
            {/* Splash & Onboarding */}
            <Route path="/" element={<Splash1 />} />
            <Route path="/splash2" element={<Splash2 />} />
            <Route path="/splash3" element={<Splash3 />} />
            <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
            
            {/* Auth Flow */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
            
            {/* Onboarding Steps */}
            <Route path="/onboarding-splash" element={<OnboardingSplash />} />
            <Route path="/onboarding-step1" element={<Step1Weight />} />
            <Route path="/onboarding-step2" element={<Step2Height />} />
            
            {/* Main App */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/workout/:date" element={<WorkoutScreen />} />
            <Route path="/workout-success" element={<ProtectedRoute><WorkoutSuccess /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/upload-data" element={<ProtectedRoute><DataUpload /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;