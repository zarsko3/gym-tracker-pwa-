import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { DEFAULT_TEMPLATES } from '../../services/templates';
import ExerciseCard from './ExerciseCard';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';

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

const WorkoutLogger: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [exercises, setExercises] = useState<Array<{
    name: string;
    sets: Array<{ reps: number; weight: number; }>;
  }>>([]);

  useEffect(() => {
    if (!user || !date) return;

    const loadWorkout = async () => {
      try {
        const workoutRef = doc(db, 'users', user.uid, 'workouts', date);
        const workoutSnap = await getDoc(workoutRef);
        
        if (workoutSnap.exists()) {
          const data = workoutSnap.data() as WorkoutData;
          setWorkoutData(data);
          setSelectedType(data.workoutType);
          setExercises(data.exercises || []);
        } else {
          // Initialize empty workout
          setWorkoutData({
            date,
            workoutType: '',
            templateId: '',
            exercises: []
          });
        }
      } catch (error) {
        console.error('Error loading workout:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [user, date]);

  const handleWorkoutTypeSelect = (type: string) => {
    if (type === 'Rest') {
      handleSaveWorkout('Rest', []);
      return;
    }

    setSelectedType(type);
    const template = DEFAULT_TEMPLATES['ppl-default'];
    const exerciseNames = template.workouts[type as keyof typeof template.workouts] || [];
    
    const newExercises = exerciseNames.map((name: string) => ({
      name,
      sets: [{ reps: 0, weight: 0 }]
    }));
    
    setExercises(newExercises);
  };

  const handleExerciseUpdate = (index: number, updatedExercise: typeof exercises[0]) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    setExercises(newExercises);
  };

  const handleSaveWorkout = async (type?: string, exerciseData?: typeof exercises) => {
    if (!user || !date) return;

    setSaving(true);
    try {
      const workoutType = type || selectedType;
      const exerciseList = exerciseData || exercises;

      const workoutToSave: WorkoutData = {
        date,
        workoutType,
        templateId: 'ppl-default',
        exercises: exerciseList
      };

      const workoutRef = doc(db, 'users', user.uid, 'workouts', date);
      await setDoc(workoutRef, workoutToSave);
      
      setWorkoutData(workoutToSave);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDateReadable = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-white">
              {formatDateReadable(date!)}
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedType ? (
          /* Workout Type Selection */
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Select Workout Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleWorkoutTypeSelect('Push')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200"
              >
                Push
              </button>
              <button
                onClick={() => handleWorkoutTypeSelect('Pull')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200"
              >
                Pull
              </button>
              <button
                onClick={() => handleWorkoutTypeSelect('Legs')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200"
              >
                Legs
              </button>
              <button
                onClick={() => handleWorkoutTypeSelect('Rest')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200"
              >
                Rest
              </button>
            </div>
          </div>
        ) : selectedType === 'Rest' ? (
          /* Rest Day */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-2xl font-semibold text-white mb-4">Rest Day</h2>
            <p className="text-gray-400 mb-6">Take a well-deserved break!</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          /* Exercise Logging */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {selectedType} Workout
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedType('')}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Change Type
                </button>
                <button
                  onClick={() => handleSaveWorkout()}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Workout'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <ExerciseCard
                  key={index}
                  exercise={exercise}
                  onUpdate={(updatedExercise) => handleExerciseUpdate(index, updatedExercise)}
                  workoutDate={date!}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutLogger;
