import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const OnboardingSplash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-primary)] px-6 py-12">
      <div className="flex flex-col items-center justify-center h-full">
        {/* Profile image placeholder */}
        <div className="relative mb-8">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-light-blue)] flex items-center justify-center">
            <div className="text-6xl">👤</div>
          </div>
          
          {/* Floating stat card */}
          <div className="absolute bottom-4 left-4 glass-card p-4 min-w-[120px]">
            <p className="text-figma-caption text-white/60 mb-1">TARGET</p>
            <p className="text-figma-h2 text-white">165 cm</p>
          </div>
        </div>

        <h1 className="text-figma-h1 text-white text-center mb-4">
          Start your<br />Fitness Journey
        </h1>
        <p className="text-figma-body text-[var(--color-text-secondary)] text-center mb-8">
          Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit
        </p>

        <button
          onClick={() => navigate('/onboarding-step1')}
          className="w-full max-w-sm flex items-center justify-between bg-white rounded-full p-4"
        >
          <span className="text-figma-body font-semibold text-[var(--color-primary)]">
            Lets start
          </span>
          <ChevronRight className="w-6 h-6 text-[var(--color-primary)]" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingSplash;
