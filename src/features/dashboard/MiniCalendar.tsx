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
  const DAY_NAMES = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <button className="text-sm text-[var(--color-pink)] hover:text-[var(--color-light-pink)] transition-colors">
          View All
        </button>
      </div>

      {/* Day Names Row */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAY_NAMES.map((dayName, index) => (
          <div key={dayName} className="text-center">
            <div className={`text-sm font-semibold ${
              index === 4 ? 'text-white' : 'text-white/32'
            }`}>
              {dayName}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + i);
          
          const dateString = formatDateISO(dayDate);
          const dateNum = dayDate.getDate();
          const workoutData = workouts[dateString];
          
          return (
            <div key={dateString} className="text-center">
              <div
                onClick={() => onDayClick?.(dateString)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isToday(dayDate) 
                    ? 'bg-[var(--color-pink)] text-white' 
                    : workoutData 
                      ? 'bg-[var(--color-card-light)] text-white' 
                      : 'text-white/47'
                }`}
              >
                {dateNum}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
