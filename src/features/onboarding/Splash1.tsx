import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Splash1: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/splash2');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-[var(--color-primary)] flex items-center justify-center">
      <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
        <Dumbbell className="w-10 h-10 text-white" />
      </div>
    </div>
  );
};

export default Splash1;
