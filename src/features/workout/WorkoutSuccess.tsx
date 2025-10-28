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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#262135' }}>
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-3 pb-2">
        <span 
          className="text-white"
          style={{
            fontSize: '14px',
            fontFamily: 'Montserrat Alternates',
            fontWeight: 500
          }}
        >
          9:41
        </span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Confetti Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient confetti elements with exact Figma colors */}
        <div 
          className="absolute top-20 left-8 w-4 h-4 rounded-full opacity-80 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute top-32 right-12 w-3 h-3 rounded-full opacity-60 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0.5s'
          }}
        ></div>
        <div 
          className="absolute top-40 left-16 w-2 h-2 rounded-full opacity-70 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '1s'
          }}
        ></div>
        
        <div 
          className="absolute top-24 right-8 w-3 h-3 rounded-full opacity-80 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0.3s'
          }}
        ></div>
        <div 
          className="absolute top-36 left-12 w-2 h-2 rounded-full opacity-60 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0.8s'
          }}
        ></div>
        <div 
          className="absolute top-44 right-16 w-4 h-4 rounded-full opacity-70 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '1.2s'
          }}
        ></div>
        
        <div 
          className="absolute top-28 left-20 w-2 h-2 rounded-full opacity-80 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0.6s'
          }}
        ></div>
        <div 
          className="absolute top-38 right-20 w-3 h-3 rounded-full opacity-60 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '1.1s'
          }}
        ></div>
        <div 
          className="absolute top-48 left-24 w-2 h-2 rounded-full opacity-70 animate-bounce" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)',
            animationDelay: '0.9s'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full px-6 py-12">
        {/* Success Card */}
        <div 
          className="bg-white text-center max-w-sm w-full"
          style={{
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div 
            className="rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #ff6b9d 0%, #ffd966 100%)'
            }}
          >
            <Flame className="w-8 h-8 text-white" />
          </div>
          
          <h1 
            className="text-[#262135] mb-4 leading-tight"
            style={{
              fontSize: '16px',
              fontFamily: 'Montserrat Alternates',
              fontWeight: 700,
              lineHeight: '17.28px'
            }}
          >
            Training completed successfully
          </h1>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-[#262135] rounded-2xl"
            style={{
              backgroundColor: '#a7e8f5',
              padding: '16px',
              fontSize: '15px',
              fontFamily: 'Montserrat Alternates',
              fontWeight: 600,
              lineHeight: '18.28px',
              borderRadius: '27.5px'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSuccess;
