import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const OnboardingSplash: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenLayout contentClassName="flex h-full flex-col items-center justify-center px-6 py-12">
      <div className="relative mb-8">
        <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-light-blue)]">
          <div className="text-6xl">👤</div>
        </div>

        <div className="glass-card absolute bottom-4 left-4 min-w-[120px] p-4">
          <p className="mb-1 text-figma-caption text-white/60">TARGET</p>
          <p className="text-figma-h2 text-white">165 cm</p>
        </div>
      </div>

      <h1 className="mb-4 text-center text-figma-h1 text-white">
        Start your<br />Fitness Journey
      </h1>
      <p className="mb-8 text-center text-figma-body text-[var(--color-text-secondary)]">
        Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit
      </p>

      <button
        onClick={() => navigate('/onboarding-step1')}
        className="flex w-full max-w-sm items-center justify-between rounded-full bg-white p-4"
      >
        <span className="text-figma-body font-semibold text-[var(--color-primary)]">
          Lets start
        </span>
        <ChevronRight className="h-6 w-6 text-[var(--color-primary)]" />
      </button>
    </ScreenLayout>
  );
};

export default OnboardingSplash;
