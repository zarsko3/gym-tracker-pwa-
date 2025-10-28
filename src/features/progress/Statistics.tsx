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
import { TrendingUp, Zap } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';

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
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
        <div className="spinner"></div>
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
    <div className="min-h-screen bg-[var(--color-primary)] pb-24">
      {/* Header - Enhanced */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-figma-h1 text-white mb-1">Your Statistics</h1>
            <p className="text-figma-caption text-[var(--color-text-secondary)]">
              Track your fitness progress
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-pink)] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Tab Buttons - Enhanced */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 bg-[var(--color-card-dark)] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('whole')}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'whole' 
                ? 'bg-white text-[var(--color-primary)] shadow-lg' 
                : 'text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            Whole
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'week' 
                ? 'bg-white text-[var(--color-primary)] shadow-lg' 
                : 'text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="px-6 space-y-6">
        {/* Calories Chart - Enhanced */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/5 via-transparent to-[var(--color-yellow)]/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-figma-h3 text-white">Calories Burned</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--color-pink)] rounded-full"></div>
                <span className="text-sm text-[var(--color-text-secondary)]">Last 7 days</span>
              </div>
            </div>
            <div className="h-32">
              <Bar data={getCaloriesData()} options={chartOptions} />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="text-[var(--color-text-secondary)]">
                Avg: {Math.round(getCaloriesData().datasets[0].data.reduce((a, b) => a + b, 0) / 7)} cal/day
              </div>
              <div className="text-[var(--color-pink)] font-medium">
                +12% vs last week
              </div>
            </div>
          </div>
        </div>

        {/* Weight Chart - Enhanced */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)]/5 via-transparent to-[var(--color-light-blue)]/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-figma-h3 text-white">Weight Progress</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--color-yellow)] rounded-full"></div>
                <span className="text-sm text-[var(--color-text-secondary)]">Last 7 days</span>
              </div>
            </div>
            <div className="h-32">
              <Line data={getWeightData()} options={chartOptions} />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="text-[var(--color-text-secondary)]">
                Current: 70.2 kg
              </div>
              <div className="text-[var(--color-yellow)] font-medium">
                -0.3 kg this week
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="w-12 h-12 bg-[var(--color-pink)]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-[var(--color-pink)]" />
            </div>
            <p className="text-2xl font-bold text-white">15</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Workouts this month</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-12 h-12 bg-[var(--color-yellow)]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-[var(--color-yellow)]" />
            </div>
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Day streak</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="statistics" />
    </div>
  );
};

export default Statistics;
