import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InlineWorkoutPanel from './InlineWorkoutPanel';

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

interface CalendarProps {
  workouts: Record<string, WorkoutData>;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC<CalendarProps> = ({ workouts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthYearHeader = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const changeWeek = (days: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (dateString: string) => {
    setExpandedDate(expandedDate === dateString ? null : dateString);
  };

  const weekStart = getWeekStartDate(currentDate);

  return (
    <div>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => changeWeek(-7)}
          className="btn-ios-stepper" 
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-white">
          Week of {getMonthYearHeader(currentDate)}
        </h2>
        <button 
          onClick={() => changeWeek(7)}
          className="btn-ios-stepper"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={goToToday}
        className="w-full mb-4 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
      >
        Go to Today
      </button>
      
      {/* Day grid - scrollable on small screens */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 overflow-x-auto">
        {Array.from({ length: 7 }, (_, i) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + i);
          
          const dateString = formatDateISO(dayDate);
          const dayName = DAY_NAMES[dayDate.getDay()];
          const dateNum = dayDate.getDate();
          const workoutData = workouts[dateString];
          
          return (
            <div key={dateString}>
              <div
                onClick={() => handleDayClick(dateString)}
                className={`calendar-day min-w-[48px] sm:min-w-[64px] ${isToday(dayDate) ? 'today' : ''} ${expandedDate === dateString ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDayClick(dateString);
                  }
                }}
                aria-label={`${dayName} ${dateNum}${workoutData ? ` - ${workoutData.workoutType} workout` : ''}`}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-400">{dayName}</span>
                <span className="text-lg sm:text-2xl font-bold mt-1">{dateNum}</span>
                {workoutData && (
                  <div className={`workout-marker workout-${workoutData.workoutType.toLowerCase()}`}></div>
                )}
              </div>
              
              {expandedDate === dateString && (
                <InlineWorkoutPanel 
                  date={dateString}
                  existingWorkout={workoutData}
                  onClose={() => setExpandedDate(null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
