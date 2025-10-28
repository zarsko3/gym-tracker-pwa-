import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';

const WorkoutSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] relative overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-3 pb-2">
        <span className="text-white text-sm font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Confetti Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Purple confetti */}
        <div className="absolute top-20 left-8 w-4 h-4 bg-purple-400 rounded-full opacity-80 animate-bounce"></div>
        <div className="absolute top-32 right-12 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 left-16 w-2 h-2 bg-purple-500 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '1s' }}></div>
        
        {/* Orange confetti */}
        <div className="absolute top-24 right-8 w-3 h-3 bg-orange-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-36 left-12 w-2 h-2 bg-orange-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-44 right-16 w-4 h-4 bg-orange-500 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
        
        {/* Yellow confetti */}
        <div className="absolute top-28 left-20 w-2 h-2 bg-yellow-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute top-38 right-20 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.1s' }}></div>
        <div className="absolute top-48 left-24 w-2 h-2 bg-yellow-500 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.9s' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full px-6 py-12">
        {/* Success Card */}
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          
          <h1 className="text-figma-h2 text-[var(--color-primary)] mb-4">
            Training completed successfully
          </h1>
          
          <p className="text-figma-body text-gray-600 mb-8">
            Great job! You've completed your workout. Keep up the excellent work!
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[var(--color-light-blue)] text-[var(--color-primary)] py-4 rounded-xl font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSuccess;
