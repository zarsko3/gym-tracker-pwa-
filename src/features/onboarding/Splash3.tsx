import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Splash3: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-[var(--color-primary)] flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-8">
        <Dumbbell className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-figma-h1 text-white text-center">
        Start your<br />Fitness Journey
      </h1>
    </div>
  );
};

export default Splash3;
