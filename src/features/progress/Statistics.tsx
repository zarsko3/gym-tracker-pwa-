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
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-figma-h1 text-white mb-1">Your Statistics</h1>
      </div>

      {/* Tab Buttons */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('whole')}
            className={`px-6 py-2 rounded-full text-sm font-medium ${
              activeTab === 'whole' 
                ? 'bg-white text-[var(--color-primary)]' 
                : 'bg-[var(--color-card-dark)] text-[var(--color-text-muted)]'
            }`}
          >
            Whole
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`px-6 py-2 rounded-full text-sm font-medium ${
              activeTab === 'week' 
                ? 'bg-white text-[var(--color-primary)]' 
                : 'bg-[var(--color-card-dark)] text-[var(--color-text-muted)]'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="px-6 space-y-6">
        {/* Calories Chart */}
        <div className="glass-card p-6">
          <h3 className="text-figma-h3 text-white mb-4">Calories</h3>
          <div className="h-32">
            <Bar data={getCaloriesData()} options={chartOptions} />
          </div>
        </div>

        {/* Weight Chart */}
        <div className="glass-card p-6">
          <h3 className="text-figma-h3 text-white mb-4">Weight</h3>
          <div className="h-32">
            <Line data={getWeightData()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="statistics" />
    </div>
  );
};

export default Statistics;
