import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface RepsControlProps {
  reps: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const RepsControl: React.FC<RepsControlProps> = ({ reps, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={onDecrease}
        className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Decrease reps"
      >
        <Minus size={18} color="white" />
      </button>
      
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-white">{reps}</span>
        <span className="text-sm text-[var(--color-text-secondary)]">reps</span>
      </div>
      
      <button 
        onClick={onIncrease}
        className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Increase reps"
      >
        <Plus size={18} color="white" />
      </button>
    </div>
  );
};

export default RepsControl;
