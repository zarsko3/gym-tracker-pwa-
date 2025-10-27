import { useState, useEffect, useCallback } from 'react';

interface RestTimerState {
  timeRemaining: number;
  isActive: boolean;
  defaultRestSeconds: number;
}

export const useRestTimer = (defaultRestSeconds = 90) => {
  const [state, setState] = useState<RestTimerState>({
    timeRemaining: defaultRestSeconds,
    isActive: false,
    defaultRestSeconds
  });

  // Timer countdown effect
  useEffect(() => {
    let interval: number | null = null;

    if (state.isActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          
          // Trigger notification when timer reaches 0
          if (newTime <= 0) {
            // Vibrate if supported
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]); // Pattern: vibrate, pause, vibrate
            }
            
            // Play notification sound if supported
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBz2O0fPTgjMGHm7A7+OZURE=');
              audio.volume = 0.3;
              audio.play().catch(() => {}); // Ignore errors
            } catch (error) {
              // Ignore audio errors
            }
          }
          
          return {
            ...prev,
            timeRemaining: Math.max(0, newTime),
            isActive: newTime > 0
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isActive, state.timeRemaining]);

  const start = useCallback((customSeconds?: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: customSeconds || prev.defaultRestSeconds,
      isActive: true
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true
    }));
  }, []);

  const skip = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      timeRemaining: 0
    }));
  }, []);

  const reset = useCallback((customSeconds?: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: customSeconds || prev.defaultRestSeconds,
      isActive: false
    }));
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining: state.timeRemaining,
    isActive: state.isActive,
    start,
    pause,
    resume,
    skip,
    reset,
    formattedTime: formatTime(state.timeRemaining),
    isComplete: state.timeRemaining === 0
  };
};
