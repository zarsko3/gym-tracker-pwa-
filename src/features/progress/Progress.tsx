import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { KEY_LIFTS } from '../../services/templates';
import { ArrowLeft, BarChart3, TrendingUp, Calendar } from 'lucide-react';

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

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Record<string, WorkoutData>>({});
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(KEY_LIFTS[0]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

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

  const getFilteredWorkouts = () => {
    const now = new Date();
    const filteredWorkouts: Record<string, WorkoutData> = {};

    Object.entries(workouts).forEach(([date, workout]) => {
      const workoutDate = new Date(date);
      let include = false;

      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          include = workoutDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          include = workoutDate >= monthAgo;
          break;
        case 'all':
        default:
          include = true;
          break;
      }

      if (include) {
        filteredWorkouts[date] = workout;
      }
    });

    return filteredWorkouts;
  };

  const getExerciseProgress = () => {
    const filteredWorkouts = getFilteredWorkouts();
    const progressData: Array<{ date: string; maxWeight: number; volume: number }> = [];

    Object.entries(filteredWorkouts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, workout]) => {
        const exercise = workout.exercises.find(e => e.name === selectedExercise);
        if (exercise && exercise.sets.length > 0) {
          const maxWeight = Math.max(...exercise.sets.map(set => set.weight || 0));
          const volume = exercise.sets.reduce((sum, set) => sum + (set.reps || 0) * (set.weight || 0), 0);
          
          if (maxWeight > 0) {
            progressData.push({ date, maxWeight, volume });
          }
        }
      });

    return progressData;
  };

  const getVolumeProgress = () => {
    const filteredWorkouts = getFilteredWorkouts();
    const volumeData: Array<{ date: string; totalVolume: number }> = [];

    Object.entries(filteredWorkouts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, workout]) => {
        let totalVolume = 0;
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            totalVolume += (set.reps || 0) * (set.weight || 0);
          });
        });
        
        if (totalVolume > 0) {
          volumeData.push({ date, totalVolume });
        }
      });

    return volumeData;
  };

  const getWorkoutFrequency = () => {
    const filteredWorkouts = getFilteredWorkouts();
    const frequency: Record<string, number> = {};

    Object.values(filteredWorkouts).forEach(workout => {
      frequency[workout.workoutType] = (frequency[workout.workoutType] || 0) + 1;
    });

    return frequency;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const exerciseProgress = getExerciseProgress();
  const volumeProgress = getVolumeProgress();
  const workoutFrequency = getWorkoutFrequency();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Progress Tracking
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Time Range Selector */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Time Range</h2>
            <div className="flex space-x-4">
              {[
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
                { value: 'all', label: 'All Time' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeRange === value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Progress */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Exercise Progress</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Exercise:
              </label>
              <select
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
            
            {exerciseProgress.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Max Weight</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...exerciseProgress.map(p => p.maxWeight))}kg
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Workouts</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {exerciseProgress.length}
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Best Volume</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...exerciseProgress.map(p => p.volume)).toLocaleString()}kg
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Progress</h3>
                  <div className="space-y-2">
                    {exerciseProgress.slice(-5).reverse().map((progress, index) => (
                      <div key={progress.date} className="flex justify-between items-center">
                        <span className="text-gray-300">
                          {new Date(progress.date).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-indigo-400">
                            Max: {progress.maxWeight}kg
                          </span>
                          <span className="text-green-400">
                            Vol: {progress.volume.toLocaleString()}kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No data available for {selectedExercise} in the selected time range.
              </p>
            )}
          </div>

          {/* Volume Progress */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Volume Progress</h2>
            {volumeProgress.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Total Volume</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {volumeProgress.reduce((sum, p) => sum + p.totalVolume, 0).toLocaleString()}kg
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Average per Workout</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(volumeProgress.reduce((sum, p) => sum + p.totalVolume, 0) / volumeProgress.length).toLocaleString()}kg
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No volume data available in the selected time range.
              </p>
            )}
          </div>

          {/* Workout Frequency */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Workout Frequency</h2>
            {Object.keys(workoutFrequency).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(workoutFrequency).map(([type, count]) => (
                  <div key={type} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{type}</span>
                      <span className="text-2xl font-bold text-indigo-400">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No workout data available in the selected time range.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
