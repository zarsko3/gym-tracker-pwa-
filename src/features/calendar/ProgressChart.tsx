import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { KEY_LIFTS } from '../../services/templates';

ChartJS.register(
  CategoryScale,
  LinearScale,
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

interface ProgressChartProps {
  workouts: Record<string, WorkoutData>;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState(KEY_LIFTS[0]);

  const getChartData = () => {
    const chartData = {
      labels: [] as string[],
      data: [] as number[]
    };

    // Get all sorted dates
    const sortedDates = Object.keys(workouts).sort();
    
    sortedDates.forEach(date => {
      const workout = workouts[date];
      if (workout.exercises && workout.exercises.length > 0) {
        const exercise = workout.exercises.find(e => e.name === selectedExercise);
        if (exercise && exercise.sets.length > 0) {
          // Find max weight for this day
          const maxWeight = Math.max(...exercise.sets.map(set => set.weight || 0));
          if (maxWeight > 0) {
            chartData.labels.push(date);
            chartData.data.push(maxWeight);
          }
        }
      }
    });

    return chartData;
  };

  const chartData = getChartData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Max Weight - ${selectedExercise}`,
        data: chartData.data,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 3,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#9CA3AF' },
        grid: { color: '#4B5563' }
      },
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#D1D5DB' }
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-400 mb-1">
          Select Exercise:
        </label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {KEY_LIFTS.map(lift => (
            <option key={lift} value={lift}>
              {lift}
            </option>
          ))}
        </select>
      </div>
      <div className="relative h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
