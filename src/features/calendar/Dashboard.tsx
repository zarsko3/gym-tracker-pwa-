import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import MiniCalendar from '../dashboard/MiniCalendar';
import ProgressLineChart from '../dashboard/ProgressLineChart';
import TodayWorkoutCard from '../dashboard/TodayWorkoutCard';
import QuickStatsCard from '../dashboard/QuickStatsCard';
import CategoryCards from '../dashboard/CategoryCards';
import RecentActivityList from '../dashboard/RecentActivityList';
import BottomNavigation from '../../components/BottomNavigation';
import WorkoutSelectionMenu from '../workout/WorkoutSelectionMenu';

interface WorkoutData {
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Record<string, WorkoutData>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'workouts'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData: Record<string, WorkoutData> = {};
      snapshot.docs.forEach(doc => {
        workoutData[doc.id] = doc.data() as WorkoutData;
      });
      setWorkouts(workoutData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];
  const greeting = `Hi, ${user?.displayName || 'User'}`;
  const dateStr = today.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long', 
    year: 'numeric' 
  });

  const handleDayClick = (dateString: string) => {
    console.log('Dashboard day clicked:', dateString);
    setSelectedDate(dateString);
  };

  // Get today's workout
  const todayWorkout = workouts[todayDateStr];

  return (
    <div className="min-h-screen bg-[var(--color-primary)] pb-24">
      {/* Header with enhanced styling */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-figma-h1 text-white mb-1">{greeting}</h1>
            <p className="text-figma-caption text-[var(--color-text-secondary)]">
              {dateStr}
            </p>
          </div>
          {/* Profile indicator */}
          <div className="w-10 h-10 rounded-full bg-[var(--color-pink)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Workout Card - Enhanced */}
      <div className="px-6 mb-6">
        <TodayWorkoutCard 
          todayWorkout={todayWorkout} 
          todayDate={todayDateStr} 
        />
      </div>

      {/* Quick Stats - Enhanced layout */}
      <div className="px-6 mb-6">
        <QuickStatsCard workouts={workouts} />
      </div>

      {/* Categories - Enhanced with better spacing */}
      <div className="px-6 mb-6">
        <CategoryCards workouts={workouts} />
      </div>

      {/* Calendar Widget - Enhanced styling */}
      <div className="px-6 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-figma-h3 text-white">Calendar</h3>
            <button className="text-sm text-[var(--color-pink)] hover:text-[var(--color-light-pink)] transition-colors">
              View All
            </button>
          </div>
          <MiniCalendar 
            workouts={workouts} 
            currentDate={today} 
            onDayClick={handleDayClick}
          />
        </div>
      </div>

      {/* Progress Chart - Enhanced with title */}
      <div className="px-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-figma-h3 text-white">Progress</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                Week
              </button>
              <button className="px-3 py-1 text-xs bg-[var(--color-pink)] rounded-full text-white">
                Month
              </button>
            </div>
          </div>
          <ProgressLineChart workouts={workouts} />
        </div>
      </div>

      {/* Workout Selection Menu */}
      {selectedDate && (
        <WorkoutSelectionMenu
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Dashboard;