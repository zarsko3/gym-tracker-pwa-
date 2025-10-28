import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface WorkoutSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onWorkoutSelect: (workoutType: 'push' | 'pull' | 'legs', date: Date) => void;
}

const WorkoutSelectionPopup: React.FC<WorkoutSelectionPopupProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onWorkoutSelect,
}) => {
  const navigate = useNavigate();

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleWorkoutClick = (workoutType: 'push' | 'pull' | 'legs') => {
    onWorkoutSelect(workoutType, selectedDate);
    
    // Navigate to workout screen
    const dateStr = selectedDate.toISOString().split('T')[0];
    navigate(`/workout/${dateStr}?type=${workoutType}`);
    
    // Close popup after a short delay for smooth transition
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const workoutOptions = [
    {
      type: 'push' as const,
      label: 'Push',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500',
      icon: ArrowUp,
    },
    {
      type: 'pull' as const,
      label: 'Pull',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500',
      icon: ArrowDown,
    },
    {
      type: 'legs' as const,
      label: 'Legs',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500',
      icon: Zap,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative w-full max-w-md mx-auto transform transition-all duration-300 ease-out workout-popup-enter-active">
        <div className="bg-[#2B2440] rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Select Workout
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Workout Options - Horizontal Layout */}
          <div className="flex gap-3">
            {workoutOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => handleWorkoutClick(option.type)}
                  className={`flex-1 rounded-2xl p-4 text-center transition-all duration-200 hover:scale-105 active:scale-95 group workout-option-hover`}
                  style={{
                    background: `linear-gradient(135deg, ${option.bgColor.replace('bg-', '')} 0%, ${option.bgColor.replace('bg-', '')}dd 100%)`,
                    boxShadow: `0 8px 32px ${option.bgColor.replace('bg-', '')}40`,
                  }}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon 
                        className="w-6 h-6" 
                        style={{
                          color: option.type === 'push' ? '#10B981' : 
                                 option.type === 'pull' ? '#3B82F6' : '#8B5CF6'
                        }}
                      />
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      {option.label}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs text-center">
              Your workout will be saved automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSelectionPopup;
