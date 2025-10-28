import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { DEFAULT_TEMPLATES } from '../../services/templates';

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

type WorkoutScreenProps = {
  timerSeconds?: number;            // e.g., 38
  exerciseName?: string;            // "Overhead Shoulder Press"
  setIndex?: number;                // 1-based
  reps?: number;                    // 10
  weight?: number;                  // 70
  onBack?: () => void;
  exercises?: string[];
  activeIndex?: number;             // index in exercises[]
};

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  timerSeconds = 38,
  exerciseName = "Overhead Shoulder Press",
  setIndex = 1,
  reps = 10,
  weight = 70,
  onBack = () => {},
  exercises = [
    "Bench Press or Dumbbell Press",
    "Overhead Shoulder Press",
    "Incline Dumbbell Press",
    "Lateral Raises",
    "Triceps Pushdowns",
  ],
  activeIndex = 1,
}) => {
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const workoutType = searchParams.get('type') || 'Push';
  
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [currentReps, setCurrentReps] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!date) return;

    const workoutType = searchParams.get('type') || 'Push';
    console.log('WorkoutScreen loaded with:', { date, workoutType, searchParams: searchParams.toString(), user: !!user });

    const loadWorkout = async () => {
      try {
        if (!user) {
          // Create mock workout data for testing
          const template = DEFAULT_TEMPLATES['ppl-default'];
          const exerciseNames = template.workouts[workoutType as keyof typeof template.workouts] || [];
          
          const newExercises = exerciseNames.map((name: string) => ({
            name,
            sets: [{ reps: 10, weight: 70, completed: false }]
          }));

          const newWorkout: WorkoutData = {
            date,
            workoutType,
            templateId: 'ppl-default',
            exercises: newExercises
          };

          console.log('Created new workout:', newWorkout);
          setWorkoutData(newWorkout);
          setLoading(false);
          return;
        }

        const workoutRef = doc(db, 'users', user.uid, 'workouts', date);
        const workoutSnap = await getDoc(workoutRef);
        
        if (workoutSnap.exists()) {
          const data = workoutSnap.data() as WorkoutData;
          setWorkoutData(data);
          if (data.exercises.length > 0) {
            setCurrentWeight(data.exercises[0].sets[0]?.weight || 70);
            setCurrentReps(data.exercises[0].sets[0]?.reps || 10);
          }
        } else {
          // Initialize with selected workout type
          const template = DEFAULT_TEMPLATES['ppl-default'];
          const exerciseNames = template.workouts[workoutType as keyof typeof template.workouts] || [];
          
          const newExercises = exerciseNames.map((name: string) => ({
            name,
            sets: [{ reps: 10, weight: 70, completed: false }]
          }));

          const newWorkout: WorkoutData = {
            date,
            workoutType,
            templateId: 'ppl-default',
            exercises: newExercises
          };

          setWorkoutData(newWorkout);
        }
      } catch (error) {
        console.error('Error loading workout:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [user, date, searchParams]);

  // Timer effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const total = 90;                 // ruler max (visual)
  const min = 50;                   // ruler min (visual)
  const progress = (timerSeconds % 60) / 60; // fake 0..1
  const dash = 100 - progress * 100;

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  // Use workout data if available, otherwise use props
  const displayExercises = workoutData?.exercises?.map(ex => ex.name) || exercises;
  const displayExerciseName = workoutData?.exercises?.[currentExerciseIndex]?.name || exerciseName;
  const displayWeight = currentWeight;
  const displayReps = currentReps;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading {workoutType} workout for {date}...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center p-4"
      style={{ background: "linear-gradient(135deg, #e0ece9 0%, #d4e6e1 100%)" }}
    >
      <div
        className="relative w-[360px] h-[760px] rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(180deg, #2d2840 0%, #262135 60%)" }}
      >
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2">
          <span className="text-white text-sm font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-4">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-black/35 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            ←
          </button>

          {/* Timer ring - Enhanced */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4"/>
              <circle
                cx="18" cy="18" r="16" fill="none"
                stroke="url(#timerGradient)" strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={dash}
                strokeLinecap="round"
              />
            </svg>
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#ffd966" />
              </linearGradient>
            </defs>
            <div className="absolute inset-0 grid place-items-center text-white text-xs font-semibold">
              {timerSeconds.toString().padStart(2, "0")}s
            </div>
          </div>
        </div>

        {/* Title - Enhanced */}
        <div className="px-6 mt-8 text-center text-white">
          <h1 className="text-xl font-extrabold leading-tight bg-gradient-to-r from-white to-[var(--color-light-pink)] bg-clip-text text-transparent">
            {displayExerciseName}
          </h1>
          <p className="text-sm text-white/60 mt-2">Set {setIndex} of {displayExercises.length}</p>
        </div>

        {/* Reps + Ruler - Enhanced */}
        <div className="px-6 mt-8 flex items-center justify-center gap-6">
          <div className="grid place-items-center">
            <div className="text-white/80 text-sm mb-2">Set {setIndex}</div>
            <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-[var(--color-pink)]/20 to-[var(--color-yellow)]/20 backdrop-blur grid place-items-center text-white font-bold border border-white/10">
              <div className="text-[11px] leading-3 opacity-80">{displayReps}</div>
              <div className="text-[11px] leading-3">reps</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-white/80 text-sm text-center mb-2">Weight (kg)</div>

            {/* Ruler - Enhanced */}
            <div className="rounded-2xl px-3 py-2 bg-gradient-to-r from-[var(--color-card)] to-[var(--color-card)]/90 backdrop-blur-sm border border-white/10">
              <div className="relative">
                <input
                  type="range"
                  min={min}
                  max={total}
                  value={displayWeight}
                  className="w-full appearance-none bg-transparent cursor-pointer"
                  style={{
                    WebkitAppearance: "none",
                  }}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#262135] font-bold text-lg bg-white/90 rounded-full w-8 h-8 flex items-center justify-center">
                  {displayWeight}
                </div>
                {/* tick marks */}
                <div className="flex justify-between text-[10px] text-[#262135]/70 mt-1">
                  {[50,60,70,80,90].map(n=>(
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plus button - Enhanced */}
        <div className="grid place-items-center mt-8">
          <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-yellow)] text-white text-2xl font-bold shadow-lg hover:scale-110 active:scale-95 transition-transform">
            +
          </button>
        </div>

        {/* Pause pill - Enhanced */}
        <div className="grid place-items-center mt-10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-28 h-28 rounded-full grid place-items-center text-3xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card)]/80 backdrop-blur-sm border border-white/10"
          >
            {isPaused ? '▶' : '‖'}
          </button>
        </div>

        {/* Bottom sheet - Enhanced */}
        <div
          className="absolute left-0 right-0 bottom-0 px-5 pb-6 pt-6"
          style={{ background: "transparent" }}
        >
          <div
            className="mx-auto rounded-[28px] shadow-xl backdrop-blur px-5 py-5 border border-white/20"
            style={{
              background: "rgba(255,255,255,.95)",
              boxShadow: "0 20px 60px rgba(0,0,0,.4)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#262135]/60 text-sm font-medium">
                Exercise List
              </div>
              <div className="text-xs text-[#262135]/40">
                {currentExerciseIndex + 1} of {displayExercises.length}
              </div>
            </div>

            <ul className="space-y-2">
              {displayExercises.map((label, i) => {
                const active = i === currentExerciseIndex;
                return (
                  <li
                    key={label}
                    className={[
                      "w-full rounded-2xl px-4 py-3 text-sm font-semibold cursor-pointer transition-all duration-200",
                      active 
                        ? "bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-yellow)] text-white shadow-lg" 
                        : "bg-white text-[#262135]/90 hover:bg-gray-50 hover:shadow-md"
                    ].join(" ")}
                    onClick={() => setCurrentExerciseIndex(i)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{label}</span>
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutScreen;