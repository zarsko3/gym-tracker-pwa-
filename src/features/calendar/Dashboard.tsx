import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import IOSHeader from '../../components/iOSHeader';
import TodayWorkoutCard from '../dashboard/TodayWorkoutCard';
import QuickStatsCard from '../dashboard/QuickStatsCard';
import CategoryCards from '../dashboard/CategoryCards';
import RecentActivityList from '../dashboard/RecentActivityList';
import Calendar from './Calendar';
import VolumeChart from '../progress/VolumeChart';
import { BarChart3, Upload } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayWorkout = workouts[today];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <IOSHeader 
        title="Dashboard"
        rightAction={
          <div className="flex items-center gap-2">
            <Link to="/progress" className="btn-ios-stepper w-11 h-11">
              <BarChart3 className="w-5 h-5" />
            </Link>
            <Link to="/upload-data" className="btn-ios-stepper w-11 h-11">
              <Upload className="w-5 h-5" />
            </Link>
          </div>
        }
      />

      <main className="container-responsive py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Top */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Workout - Prominent */}
            <TodayWorkoutCard 
              todayWorkout={todayWorkout}
              todayDate={today}
            />

            {/* Quick Stats */}
            <QuickStatsCard workouts={workouts} />

            {/* Category Cards */}
            <CategoryCards workouts={workouts} />

            {/* Calendar Section */}
            <div className="card-modern p-6">
              <h3 className="text-heading-md text-white mb-4">Calendar</h3>
              <Calendar workouts={workouts} />
            </div>

            {/* Volume Chart */}
            <div className="card-modern p-6">
              <VolumeChart workouts={workouts} weeks={4} />
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            <div className="card-modern p-6 sticky top-4">
              <h3 className="text-heading-md text-white mb-4">Recent Activity</h3>
              <RecentActivityList workouts={workouts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

