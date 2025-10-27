import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import Calendar from './Calendar';
import DashboardStats from './DashboardStats';
import ProgressChart from './ProgressChart';
import VolumeChart from '../progress/VolumeChart';
import { Calendar as CalendarIcon, BarChart3, Settings, User, Upload } from 'lucide-react';
import IOSHeader from '../../components/iOSHeader';

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* iOS Header */}
      <IOSHeader 
        title="Gym Tracker"
        rightAction={
          <div className="flex items-center gap-2">
            <Link
              to="/progress"
              className="btn-ios-stepper w-11 h-11"
              aria-label="Progress"
            >
              <BarChart3 className="w-5 h-5" />
            </Link>
            <Link
              to="/upload-data"
              className="btn-ios-stepper w-11 h-11"
              aria-label="Upload Data"
            >
              <Upload className="w-5 h-5" />
            </Link>
          </div>
        }
      />

      {/* Main Content */}
      <main className="container-responsive py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Calendar - full width on mobile, 2/3 on tablet, 1/2 on desktop */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
              <Calendar workouts={workouts} />
            </div>
          </div>
          
          {/* Stats sidebar - stacked on mobile, sidebar on tablet+ */}
          <div className="col-span-1 space-y-4">
            <DashboardStats workouts={workouts} />
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Exercise Progress</h2>
              <ProgressChart workouts={workouts} />
            </div>
          </div>

          {/* Volume Chart - full width on mobile, spans both columns on tablet+ */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <VolumeChart workouts={workouts} />
          </div>

          {/* Workout Legend - full width on mobile, spans both columns on tablet+ */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Workout Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
                  Push
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                  Pull
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                  Legs
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-gray-500 mr-2"></span>
                  Rest
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
