import React from 'react';
import { Pause, Play } from 'lucide-react';

interface PauseButtonProps {
  isRunning: boolean;
  onToggle: () => void;
}

const PauseButton: React.FC<PauseButtonProps> = ({ isRunning, onToggle }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[300px] transform translate-y-1/2 z-30">
      <button 
        onClick={onToggle}
        className="w-16 h-16 rounded-full bg-[var(--color-yellow)] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        aria-label={isRunning ? "Pause workout" : "Resume workout"}
      >
        {isRunning ? (
          <Pause size={24} color="black" />
        ) : (
          <Play size={24} color="black" />
        )}
      </button>
    </div>
  );
};

export default PauseButton;
