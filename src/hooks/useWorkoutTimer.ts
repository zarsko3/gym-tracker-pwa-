import { useState, useEffect, useCallback } from 'react';

interface WorkoutTimerState {
  elapsed: number;
  isActive: boolean;
  startTime: number | null;
  pausedTime: number | null;
}

export const useWorkoutTimer = () => {
  const [state, setState] = useState<WorkoutTimerState>(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('workout-timer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const elapsed = parsed.isActive && parsed.startTime 
          ? now - parsed.startTime + (parsed.elapsed || 0)
          : parsed.elapsed || 0;
        
        return {
          elapsed: Math.max(0, elapsed),
          isActive: parsed.isActive || false,
          startTime: parsed.isActive ? now : null,
          pausedTime: parsed.pausedTime || null
        };
      } catch (error) {
        console.error('Error loading workout timer from localStorage:', error);
      }
    }
    
    return {
      elapsed: 0,
      isActive: false,
      startTime: null,
      pausedTime: null
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('workout-timer', JSON.stringify({
      elapsed: state.elapsed,
      isActive: state.isActive,
      startTime: state.startTime,
      pausedTime: state.pausedTime
    }));
  }, [state]);

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;

    if (state.isActive && state.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - state.startTime! + (state.pausedTime || 0);
        
        setState(prev => ({
          ...prev,
          elapsed: Math.max(0, elapsed)
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isActive, state.startTime, state.pausedTime]);

  const start = useCallback(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      isActive: true,
      startTime: now,
      pausedTime: prev.pausedTime || 0
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      pausedTime: prev.elapsed
    }));
  }, []);

  const resume = useCallback(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      isActive: true,
      startTime: now,
      pausedTime: prev.pausedTime || 0
    }));
  }, []);

  const stop = useCallback(() => {
    setState({
      elapsed: 0,
      isActive: false,
      startTime: null,
      pausedTime: null
    });
    localStorage.removeItem('workout-timer');
  }, []);

  const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    elapsed: state.elapsed,
    isActive: state.isActive,
    start,
    pause,
    resume,
    stop,
    formattedTime: formatDuration(state.elapsed)
  };
};
