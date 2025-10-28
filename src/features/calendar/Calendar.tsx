import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WorkoutSelectionMenu from '../workout/WorkoutSelectionMenu';

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    const startOfWeek = getWeekStartDate(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const year = startOfWeek.toLocaleDateString('en-US', { year: 'numeric' });

    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    }
    return `${startMonth} - ${endMonth} ${year}`;
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
    console.log('Calendar day clicked:', dateString);
    console.log('Setting selected date to:', dateString);
    setSelectedDate(dateString);
  };

  const weekStart = getWeekStartDate(currentDate);

  return (
    <div className="calendar-container">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => changeWeek(-7)}
          className="btn-ios-stepper w-10 h-10" 
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
          Week of {getMonthYearHeader(currentDate)}
        </h2>
        <button 
          onClick={() => changeWeek(7)}
          className="btn-ios-stepper w-10 h-10"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={goToToday}
        className="w-full mb-6 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
      >
        Go to Today
      </button>
      
      {/* Day grid - improved spacing and sizing */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Day clicked!', dateString);
                  handleDayClick(dateString);
                }}
                className={`
                  calendar-day relative overflow-hidden cursor-pointer
                  ${isToday(dayDate) ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : 'bg-gray-800/50'}
                  hover:bg-gray-700/70 transition-all duration-200
                `}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Day key pressed!', dateString);
                    handleDayClick(dateString);
                  }
                }}
                aria-label={`${dayName} ${dateNum}${workoutData ? ` - ${workoutData.workoutType} workout` : ''}`}
                style={{ pointerEvents: 'auto' }}
              >
                <span className="text-xs sm:text-sm font-medium text-gray-400 mb-1">
                  {dayName}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {dateNum}
                </span>
                {workoutData && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className={`h-1 workout-${workoutData.workoutType.toLowerCase()} opacity-80`} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Workout Selection Menu */}
      {selectedDate && (
        <div>
          <WorkoutSelectionMenu
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
