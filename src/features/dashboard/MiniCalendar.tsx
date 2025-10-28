import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkoutData {
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
    }>;
  }>;
}

interface MiniCalendarProps {
  workouts: Record<string, WorkoutData>;
  currentDate: Date;
  onDayClick?: (dateString: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ workouts, currentDate, onDayClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const weekStart = getWeekStartDate(selectedDate);
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="card-figma">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-figma-h3 text-white">This Week</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="w-8 h-8 rounded-full bg-[var(--color-card-light)] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="w-8 h-8 rounded-full bg-[var(--color-card-light)] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + i);
          
          const dateString = formatDateISO(dayDate);
          const dayName = DAY_NAMES[dayDate.getDay()];
          const dateNum = dayDate.getDate();
          const workoutData = workouts[dateString];
          
          return (
            <div key={dateString} className="text-center">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">
                {dayName}
              </div>
              <div
                onClick={() => onDayClick?.(dateString)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isToday(dayDate) 
                    ? 'bg-[var(--color-pink)] text-white' 
                    : workoutData 
                      ? 'bg-[var(--color-card-light)] text-white' 
                      : 'text-[var(--color-text-muted)]'
                }`}
              >
                {dateNum}
              </div>
              {workoutData && (
                <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${
                  workoutData.workoutType === 'Push' ? 'bg-red-500' :
                  workoutData.workoutType === 'Pull' ? 'bg-blue-500' :
                  workoutData.workoutType === 'Legs' ? 'bg-green-500' :
                  'bg-gray-500'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
