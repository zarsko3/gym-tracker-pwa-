import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Splash2: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/splash3');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ScreenLayout contentClassName="flex h-full flex-col items-center justify-center px-6">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20">
        <Dumbbell className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-center text-figma-h1 text-white">
        Start your<br />Fitness Journey
      </h1>
    </ScreenLayout>
  );
};

export default Splash2;
