import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import MiniCalendar from '../dashboard/MiniCalendar';
import TodayWorkoutCard from '../dashboard/TodayWorkoutCard';
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
  const greeting = `Hi!,\n${user?.displayName || 'Zarsko'}`;
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
      {/* Header with Figma design */}
      <div className="px-6 pt-12 pb-6 relative">
        {/* Large pink circular background element */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--color-pink)]/8 blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1 whitespace-pre-line">{greeting}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {dateStr}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className="px-6 mb-6">
        <TodayWorkoutCard 
          todayWorkout={todayWorkout} 
          todayDate={todayDateStr} 
        />
      </div>

      {/* Calendar Widget */}
      <div className="px-6 mb-6">
        <MiniCalendar 
          workouts={workouts} 
          currentDate={today} 
          onDayClick={handleDayClick}
        />
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