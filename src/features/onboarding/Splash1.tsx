import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Splash1: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/splash2');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ScreenLayout contentClassName="flex h-full items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20">
          <Dumbbell className="h-10 w-10 text-white" />
        </div>
      </div>
    </ScreenLayout>
  );
};

export default Splash1;
