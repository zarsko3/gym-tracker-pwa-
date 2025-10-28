import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface WorkoutSelectionMenuProps {
  date: string;
  onClose: () => void;
}

const WorkoutSelectionMenu: React.FC<WorkoutSelectionMenuProps> = ({ date, onClose }) => {
  const navigate = useNavigate();
  
  console.log('WorkoutSelectionMenu rendered with date:', date);

  const handleWorkoutSelect = (workoutType: string) => {
    console.log('Navigating to:', `/workout/${date}?type=${workoutType}`);
    console.log('Current location:', window.location.href);
    navigate(`/workout/${date}?type=${workoutType}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-6">
      <div className="glass-card-strong w-full max-w-xs p-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-6">
          <h2 className="text-figma-h3 text-white mb-1">
            Choose Workout
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {formatDate(date)}
          </p>
        </div>

        {/* Workout Options */}
        <div className="space-y-2">
          <button
            onClick={() => handleWorkoutSelect('Push')}
            className="w-full p-3 rounded-lg bg-[var(--color-pink)] text-white text-center hover:scale-105 transition-transform"
          >
            <div className="text-lg font-bold mb-0.5">P</div>
            <div className="text-xs">Push</div>
          </button>

          <button
            onClick={() => handleWorkoutSelect('Pull')}
            className="w-full p-3 rounded-lg bg-[var(--color-light-blue)] text-[var(--color-primary)] text-center hover:scale-105 transition-transform"
          >
            <div className="text-lg font-bold mb-0.5">P</div>
            <div className="text-xs">Pull</div>
          </button>

          <button
            onClick={() => handleWorkoutSelect('Legs')}
            className="w-full p-3 rounded-lg bg-[var(--color-yellow)] text-[var(--color-primary)] text-center hover:scale-105 transition-transform"
          >
            <div className="text-lg font-bold mb-0.5">L</div>
            <div className="text-xs">Legs</div>
          </button>
        </div>

        {/* Rest Day Option */}
        <button
          onClick={() => handleWorkoutSelect('Rest')}
          className="w-full mt-3 p-2 rounded-md bg-white/10 text-[var(--color-text-secondary)] text-center hover:bg-white/20 transition-colors"
        >
          <div className="text-xs">Rest Day</div>
        </button>
      </div>
    </div>
  );
};

export default WorkoutSelectionMenu;
