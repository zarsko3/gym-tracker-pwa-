import React, { useState, useEffect } from 'react';
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
import { TrendingUp, Zap, BarChart3 } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import ScreenLayout from '../../components/ScreenLayout';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'whole' | 'week'>('whole');

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
      <ScreenLayout contentClassName="flex h-full items-center justify-center">
        <div className="spinner" />
      </ScreenLayout>
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
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <ScreenLayout contentClassName="flex h-full flex-col px-6 pt-[86px] pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-figma-h1">Your Statistics</h1>
          <p className="text-figma-caption text-white/60">Track your fitness progress</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-6 flex gap-2 rounded-2xl bg-white/10 p-1">
        <button
          onClick={() => setActiveTab('whole')}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-medium transition ${
            activeTab === 'whole' ? 'bg-white text-[#251B3D] shadow-lg' : 'text-white/50 hover:text-white'
          }`}
        >
          Whole
        </button>
        <button
          onClick={() => setActiveTab('week')}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-medium transition ${
            activeTab === 'week' ? 'bg-white text-[#251B3D] shadow-lg' : 'text-white/50 hover:text-white'
          }`}
        >
          Week
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/8 via-transparent to-[var(--color-yellow)]/8" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-figma-h3 text-white">Calories Burned</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-2 w-2 rounded-full bg-[var(--color-pink)]" />
                Last 7 days
              </div>
            </div>
            <div className="h-32">
              <Bar data={getCaloriesData()} options={chartOptions} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-white/60">
                Avg: {Math.round(getCaloriesData().datasets[0].data.reduce((a: number, b: number) => a + b, 0) / 7)} cal/day
              </span>
              <span className="font-medium text-[var(--color-pink)]">+12% vs last week</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)]/8 via-transparent to-[var(--color-light-blue)]/8" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-figma-h3 text-white">Weight Progress</h3>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-2 w-2 rounded-full bg-[var(--color-yellow)]" />
                Last 7 days
              </div>
            </div>
            <div className="h-32">
              <Line data={getWeightData()} options={chartOptions} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-white/60">Current: 70.2 kg</span>
              <span className="font-medium text-[var(--color-yellow)]">-0.3 kg this week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-pink)]/20">
              <TrendingUp className="h-6 w-6 text-[var(--color-pink)]" />
            </div>
            <p className="text-2xl font-bold text-white">15</p>
            <p className="mt-1 text-xs text-white/60">Workouts this month</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-yellow)]/20">
              <Zap className="h-6 w-6 text-[var(--color-yellow)]" />
            </div>
            <p className="text-2xl font-bold text-white">7</p>
            <p className="mt-1 text-xs text-white/60">Day streak</p>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="statistics" className="mt-auto pt-10" />
    </ScreenLayout>
  );
};

export default Statistics;
