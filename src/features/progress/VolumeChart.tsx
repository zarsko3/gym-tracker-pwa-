import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { calculateTotalVolume } from '../../utils/workoutCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
      completed?: boolean;
    }>;
  }>;
}

interface VolumeChartProps {
  workouts: Record<string, WorkoutData>;
  weeks?: number;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ workouts, weeks = 8 }) => {
  // Get the last N weeks of data
  const getWeeklyVolumeData = () => {
    const now = new Date();
    const weeklyData: Array<{
      week: string;
      push: number;
      pull: number;
      legs: number;
      rest: number;
    }> = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      
      const weekData = {
        week: weekLabel,
        push: 0,
        pull: 0,
        legs: 0,
        rest: 0
      };

      // Calculate volume for each day in the week
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        const dateString = day.toISOString().split('T')[0];
        
        const workout = workouts[dateString];
        if (workout && workout.workoutType !== 'Rest') {
          const volume = calculateTotalVolume(workout.exercises);
          const workoutType = workout.workoutType.toLowerCase() as 'push' | 'pull' | 'legs';
          if (workoutType in weekData) {
            weekData[workoutType] += volume;
          }
        } else if (workout && workout.workoutType === 'Rest') {
          weekData.rest += 1; // Count rest days
        }
      }

      weeklyData.push(weekData);
    }

    return weeklyData;
  };

  const weeklyData = getWeeklyVolumeData();

  const data = {
    labels: weeklyData.map(week => week.week),
    datasets: [
      {
        label: 'Push',
        data: weeklyData.map(week => week.push),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pull',
        data: weeklyData.map(week => week.pull),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Legs',
        data: weeklyData.map(week => week.legs),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Volume Trends (Last ${weeks} Weeks)`,
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (value === null || value === undefined) return `${context.dataset.label}: No data`;
            if (value === 0) return `${context.dataset.label}: No volume`;
            return `${context.dataset.label}: ${value.toLocaleString()}kg`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            return `${value as number}kg`;
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  };

  // Calculate trends
  const calculateTrend = (muscleGroup: 'push' | 'pull' | 'legs') => {
    const values = weeklyData.map(week => week[muscleGroup]);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    if (firstAvg === 0) return secondAvg > 0 ? 'increasing' : 'stable';
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  };

  const pushTrend = calculateTrend('push');
  const pullTrend = calculateTrend('pull');
  const legsTrend = calculateTrend('legs');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-400';
      case 'decreasing': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Volume Trends</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-red-400">Push</span>
              <span className={getTrendColor(pushTrend)}>
                {getTrendIcon(pushTrend)}
              </span>
            </div>
            <div className="text-xs text-gray-400 capitalize">{pushTrend}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-blue-400">Pull</span>
              <span className={getTrendColor(pullTrend)}>
                {getTrendIcon(pullTrend)}
              </span>
            </div>
            <div className="text-xs text-gray-400 capitalize">{pullTrend}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-green-400">Legs</span>
              <span className={getTrendColor(legsTrend)}>
                {getTrendIcon(legsTrend)}
              </span>
            </div>
            <div className="text-xs text-gray-400 capitalize">{legsTrend}</div>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Volume is calculated as weight × reps for all completed sets
      </div>
    </div>
  );
};

export default VolumeChart;
