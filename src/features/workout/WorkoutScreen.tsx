import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Plus, Pause, Play, Minus } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

// Enhanced polished design styles
const figmaStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    outline: none;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    border-radius: 3px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255,107,157,0.4), 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    z-index: 2;
    border: 2px solid white;
    transition: all 0.2s ease;
  }
  
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
  }
  
  .slider::-moz-range-track {
    height: 6px;
    background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 100%);
    border-radius: 3px;
    border: none;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 4px 12px rgba(255,107,157,0.4), 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  
  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255,107,157,0.5), 0 2px 6px rgba(0,0,0,0.15);
  }
  
  .timer-ring {
    transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Custom scrollbar for exercise list */
  .exercise-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .exercise-list::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 3px;
  }
  
  .exercise-list::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%);
    border-radius: 3px;
  }
  
  .exercise-list::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #ff5a8a 0%, #ffd055 100%);
  }
`;

type WorkoutType = 'push' | 'pull' | 'legs';

const WorkoutScreen: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const workoutType = (searchParams.get('type') || 'push') as WorkoutType;
  
  // Exercise data
  const exercises = [
    'Bench Press or Dumbbell Press',
    'Overhead Shoulder Press',
    'Incline Dumbbell Press',
    'Lateral Raises',
    'Triceps Pushdowns',
  ];

  const [currentExercise, setCurrentExercise] = useState('Overhead Shoulder Press');
  const [setCount, setSetCount] = useState(1);
  const [repsCount, setRepsCount] = useState(10);
  const [weight, setWeight] = useState(70);
  
  const REST_PERIOD = 90; // 90 second rest timer
  const [timer, setTimer] = useState(REST_PERIOD);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            setIsTimerActive(false); // Stop timer at 0
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  // Helper to format timer
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate('/');
  };

  // This is a component for the tick marks on the slider
  const RulerTick = ({ small }: { small?: boolean }) => (
    <div className={`flex flex-col items-center space-y-1 ${small ? 'w-4' : 'w-6'}`}>
      {small && <div className="h-4 w-[2px] bg-gray-500 rounded-full" />}
      {!small && <div className="h-6 w-[3px] bg-gray-700 rounded-full" />}
    </div>
  );

  return (
    <>
      <style>{figmaStyles}</style>
      <div className="w-full min-h-screen bg-gradient-to-br from-[#2B2440] via-[#1F1934] to-[#100B1F] p-4 flex items-center justify-center">
        <div className="w-full max-w-md h-[850px] bg-gradient-to-br from-[#2B2440] via-[#1F1934] to-[#100B1F] text-white font-sans rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* 1. Top Bar: Back Button and Timer */}
          <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button
          onClick={handleBack}
              className="w-12 h-12 rounded-2xl bg-white/5 shadow-[inset_0_2px_6px_rgba(255,255,255,.06)] ring-1 ring-white/6 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group"
        >
              <ChevronLeft size={24} className="group-hover:scale-110 transition-transform duration-200" />
        </button>

            {/* Timer Component - Soft orb with inner glow */}
            <div className="relative h-[92px] w-[92px] rounded-full bg-[radial-gradient(60%_60%_at_30%_25%,#FFB86C,transparent),radial-gradient(70%_70%_at_70%_80%,#FF7CA4,transparent)] shadow-[0_8px_24px_rgba(0,0,0,.35)] ring-1 ring-white/12">
              <div className="absolute inset-2 rounded-full bg-white/5 backdrop-blur-[2px] grid place-items-center text-white/90 font-semibold text-[15px]">
                {formatTime(timer)}
          </div>
        </div>
          </header>

          {/* 2. Main Content Area */}
          <main className="w-full h-full pt-24 px-6 flex flex-col">

            {/* Exercise Title */}
            <h1 
              className="text-2xl font-bold text-center text-white mb-2"
              style={{
                fontFamily: 'Montserrat Alternates',
                lineHeight: '1.2'
              }}
            >
              {currentExercise}
            </h1>

            {/* Set Info */}
            <div className="text-center mb-8">
              <span 
                className="text-white/70 text-sm"
                style={{
                  fontFamily: 'Montserrat Alternates',
                  fontWeight: 500
                }}
              >
                set {setCount}
              </span>
            </div>

            {/* Reps and Weight Controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {/* Reps Control */}
              <div className="bg-[#2B2440] rounded-2xl px-4 py-3 flex items-center space-x-3">
                <button 
                  onClick={() => setRepsCount(r => Math.max(0, r - 1))} 
                  className="text-white/70 text-lg hover:text-white transition-colors"
                >
                  −
                </button>
                <span 
                  className="text-white text-sm font-medium min-w-[60px] text-center"
                  style={{
                    fontFamily: 'Montserrat Alternates'
                  }}
                >
                  {repsCount} reps
                </span>
                <button 
                  onClick={() => setRepsCount(r => r + 1)} 
                  className="text-white/70 text-lg hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              {/* Weight Control */}
              <div className="bg-[#F6F0B8] rounded-2xl px-6 py-4 flex items-center space-x-4">
                <button 
                  onClick={() => setWeight(w => Math.max(0, w - 2.5))} 
                  className="text-black/60 text-lg hover:text-black transition-colors"
                >
                  −
                </button>
                <div className="text-center">
                  <div 
                    className="text-black text-3xl font-bold"
                    style={{
                      fontFamily: 'Montserrat Alternates'
                    }}
                  >
                    {weight}
                  </div>
                  <div 
                    className="text-black/60 text-xs"
                    style={{
                      fontFamily: 'Montserrat Alternates'
                    }}
                  >
                    kg
                  </div>
                </div>
                <button 
                  onClick={() => setWeight(w => w + 2.5)} 
                  className="text-black/60 text-lg hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add Set Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  setSetCount(s => s + 1);
                  setTimer(REST_PERIOD); // Reset timer
                  setIsTimerActive(true); // Start timer
                }} 
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </main>

          {/* 3. Bottom Sheet */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[45%] rounded-t-3xl bg-white overflow-hidden z-20"
            style={{
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* Exercise List */}
            <div className="p-6 space-y-2 max-h-full overflow-y-auto">
              {exercises.map((exercise) => (
                <div
                  key={exercise}
                  onClick={() => setCurrentExercise(exercise)}
                  className={`py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    exercise === currentExercise
                      ? 'bg-pink-200 text-gray-800'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{
                    fontFamily: 'Montserrat Alternates',
                    fontWeight: 500
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{exercise}</span>
                    {exercise === currentExercise && (
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Overlapping Pause Button */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(45%-2rem)] z-30">
            <button 
              onClick={() => setIsTimerActive(!isTimerActive)}
              className="w-16 h-16 rounded-full flex items-center justify-center group hover:scale-105 transition-all duration-300"
              style={{
                background: '#F6F0B8',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {isTimerActive ? (
                <Pause size={24} className="text-black fill-black group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Play size={24} className="text-black fill-black group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkoutScreen;