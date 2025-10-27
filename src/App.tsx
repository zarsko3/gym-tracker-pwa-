import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Dashboard from './features/calendar/Dashboard';
import WorkoutLogger from './features/workout/WorkoutLogger';
import Progress from './features/progress/Progress';
import Templates from './features/templates/Templates';
import Profile from './features/auth/Profile';
import LoadingSpinner from './components/LoadingSpinner';
import DataUpload from './features/admin/DataUpload';
import IOSNavigation from './components/iOSNavigation';
import IOSNavigationDesktop from './components/IOSNavigationDesktop';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

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
        <div className="app bg-gray-900 text-white">
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Navigation - bottom on mobile, left on desktop */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
              <ProtectedRoute>
                <IOSNavigation />
              </ProtectedRoute>
            </div>
            <div className="hidden lg:block lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:bottom-0">
              <ProtectedRoute>
                <IOSNavigationDesktop />
              </ProtectedRoute>
            </div>
            
            {/* Main content area */}
            <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/workout/:date" 
                  element={
                    <ProtectedRoute>
                      <WorkoutLogger />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/progress" 
                  element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/templates" 
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/upload-data" 
                  element={
                    <ProtectedRoute>
                      <DataUpload />
                    </ProtectedRoute>
                  } 
                />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
