import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  onBack: () => void;
  time: string;
  isTimerRunning: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, time, isTimerRunning }) => {
  return (
    <header className="absolute top-0 left-0 right-0 px-6 pt-8 flex justify-between items-center z-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center glass-card-light"
        aria-label="Go back"
      >
        <ChevronLeft size={24} color="white" />
      </button>
      
      {/* Timer Component */}
      <div className="relative">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isTimerRunning 
              ? 'bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-yellow)]' 
              : 'bg-[var(--color-card-dark)]'
          }`}
        >
          <div className="absolute inset-1 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white text-base font-semibold">
              {time}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
