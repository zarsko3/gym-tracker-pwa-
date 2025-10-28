import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenLayout contentClassName="welcome-entrance flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-6">
        <div className="welcome-logo flex h-[100px] w-[100px] items-center justify-center rounded-full glass-logo">
          <Dumbbell className="h-12 w-12 text-white" />
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-figma-h1 leading-tight font-bold">
            Start your
            <br />Fitness Journey
          </h1>
        </div>
      </div>

      <div className="w-full max-w-[350px] px-6 space-y-4 mb-12">
        <button
          onClick={() => navigate('/login')}
          className="btn-figma-primary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Login
        </button>

        <button
          onClick={() => navigate('/signup')}
          className="btn-figma-secondary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Register
        </button>
      </div>
    </ScreenLayout>
  );
};

export default Welcome;
