import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, Zap, BarChart3, Flame, Dumbbell } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import ScreenLayout from '../../components/ScreenLayout';
import LoadingSpinner from '../../components/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Record<string, WorkoutData>>({});
  const [loading, setLoading] = useState(false); // Start with false to skip loading
  const [activeTab, setActiveTab] = useState<'whole' | 'week'>('whole');

  // Generate mock data immediately
  useEffect(() => {
    const generateMockWorkouts = (): Record<string, WorkoutData> => {
      const mockWorkouts: Record<string, WorkoutData> = {};
      const today = new Date();
      
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const workoutTypes = ['Push', 'Pull', 'Legs'];
        const workoutType = workoutTypes[i % 3];
        
        mockWorkouts[dateStr] = {
          date: dateStr,
          workoutType,
          templateId: `template-${i}`,
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { reps: 10, weight: 60 },
                { reps: 8, weight: 70 },
                { reps: 6, weight: 80 },
              ]
            },
            {
              name: 'Squat',
              sets: [
                { reps: 10, weight: 80 },
                { reps: 8, weight: 90 },
                { reps: 6, weight: 100 },
              ]
            }
          ]
        };
      }
      
      return mockWorkouts;
    };
    
    // Always set mock data for now
    setWorkouts(generateMockWorkouts());
    setLoading(false);
    
    if (!user) {
      return;
    }

    // Try to fetch from Firebase but don't override mock data if it fails
    try {
      const q = query(
        collection(db, 'users', user.uid, 'workouts'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const workoutData: Record<string, WorkoutData> = {};
        snapshot.docs.forEach(doc => {
          workoutData[doc.id] = doc.data() as WorkoutData;
        });
        
        // Only update if we have actual data
        if (Object.keys(workoutData).length > 0) {
          setWorkouts(workoutData);
        }
      }, (error) => {
        console.error('Error fetching workouts:', error);
        // Keep mock data on error
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase setup error:', error);
      // Keep mock data
    }
  }, [user]);

  console.log('Statistics render:', { loading, hasData: Object.keys(workouts).length, workouts });

  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#1B1631] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getCaloriesData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return {
      labels: last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Calories',
          data: last7Days.map(date => {
            const workout = workouts[date];
            if (!workout || workout.workoutType === 'Rest') return 0;
            // Simple calorie calculation based on workout type
            return workout.workoutType === 'Push' ? 350 : 
                   workout.workoutType === 'Pull' ? 320 : 
                   workout.workoutType === 'Legs' ? 400 : 0;
          }),
          backgroundColor: 'rgba(255, 107, 157, 0.8)',
          borderColor: '#ff6b9d',
          borderWidth: 1,
        },
      ],
    };
  };

  const getWeightData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return {
      labels: last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Weight (kg)',
          data: [70, 70.2, 69.8, 70.1, 70.3, 70.0, 70.2], // Mock data
          borderColor: '#ffd966',
          backgroundColor: 'rgba(255, 217, 102, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: '#ffd966',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Calculate statistics
  const workoutCount = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return Object.values(workouts).filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= startOfMonth && workoutDate <= now;
    }).length;
  }, [workouts]);

  const streak = useMemo(() => {
    const sortedDates = Object.keys(workouts).sort().reverse();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDateStr || (i === 0 && sortedDates[i] < today)) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [workouts]);

  const totalVolume = useMemo(() => {
    return Object.values(workouts).reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.reps * set.weight);
        }, 0);
      }, 0);
    }, 0);
  }, [workouts]);

  const hasData = Object.keys(workouts).length > 0;

  console.log('Render state:', { hasData, workoutCount, streak, totalVolume });

  return (
    <ScreenLayout>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-white leading-tight tracking-[-0.5px]">
              Statistics
            </h1>
            <p className="text-white/60 text-[15px] mt-1">Track your progress</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex-shrink-0 px-6 mb-4 z-10 bg-[#1B1631]">
        <div className="flex gap-2 rounded-2xl bg-white/8 p-1 ring-1 ring-white/10">
          <button
            onClick={() => setActiveTab('whole')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'whole' 
                ? 'bg-white text-[#251B3D] shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'week' 
                ? 'bg-white text-[#251B3D] shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="px-6 mb-2">
        <div className="text-xs text-white/40">
          Debug: {hasData ? `${Object.keys(workouts).length} workouts loaded` : 'No data'}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 bg-[#1B1631]">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 -mt-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <BarChart3 className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-white/60 text-sm max-w-xs">
              Complete some workouts to see your statistics and track your progress over time.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-pink)]/20">
                  <Dumbbell className="h-5 w-5 text-[var(--color-pink)]" />
                </div>
                <p className="text-xl font-bold text-white">{workoutCount}</p>
                <p className="mt-0.5 text-[10px] text-white/60">Workouts</p>
              </div>
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-yellow)]/20">
                  <Flame className="h-5 w-5 text-[var(--color-yellow)]" />
                </div>
                <p className="text-xl font-bold text-white">{streak}</p>
                <p className="mt-0.5 text-[10px] text-white/60">Day Streak</p>
              </div>
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-light-blue)]/20">
                  <TrendingUp className="h-5 w-5 text-[var(--color-light-blue)]" />
                </div>
                <p className="text-xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</p>
                <p className="mt-0.5 text-[10px] text-white/60">Total Vol.</p>
              </div>
            </div>

            {/* Calories Chart */}
            <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base">Calories Burned</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-pink)]" />
                    Last 7 days
                  </div>
                </div>
                <div className="h-36">
                  <Bar data={getCaloriesData()} options={chartOptions} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-white/60">
                    Avg: {Math.round(getCaloriesData().datasets[0].data.reduce((a: number, b: number) => a + b, 0) / 7)} cal/day
                  </span>
                  <span className="font-semibold text-[var(--color-pink)]">+12%</span>
                </div>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)]/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-base">Weight Progress</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-yellow)]" />
                    Last 7 days
                  </div>
                </div>
                <div className="h-36">
                  <Line data={getWeightData()} options={chartOptions} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-white/60">Current: 70.2 kg</span>
                  <span className="font-semibold text-[var(--color-yellow)]">-0.3 kg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="statistics" className="flex-shrink-0 px-6 pb-6 pt-4" />
    </ScreenLayout>
  );
};

export default Statistics;
