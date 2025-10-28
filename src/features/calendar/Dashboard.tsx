import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import DashboardWeightChart from '../dashboard/DashboardWeightChart';
import ScreenLayout from '../../components/ScreenLayout';
import WorkoutSelectionPopup from '../../components/WorkoutSelectionPopup';

type WorkoutType = 'push' | 'pull' | 'legs' | 'rest' | null;

interface WorkoutData {
  date: string; // YYYY-MM-DD format
  type: WorkoutType;
  completed: boolean;
}

interface CalendarDay {
  value: number;
  isSelected: boolean;
  isToday: boolean;
  date: Date;
  workoutType: WorkoutType;
  isCompleted: boolean;
  isFuture: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Update date every minute to handle day changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Load workout data (in a real app, this would come from an API)
  useEffect(() => {
    // Generate realistic mock workout data based on current date
    const generateMockData = (): WorkoutData[] => {
      const data: WorkoutData[] = [];
      const today = new Date();
      
      // Generate data for 14 days (3 days before today + today + 10 days after)
      for (let i = -3; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // PPL rotation for mock data
        const dayOfWeek = date.getDay();
        const pplRotation = ['rest', 'push', 'pull', 'legs', 'rest', 'push', 'pull'];
        const workoutType = pplRotation[dayOfWeek] as WorkoutType;
        
        // Only generate completed workouts for past days and today
        const completed = i <= 0 ? Math.random() > 0.3 : false; // 70% completion rate for past days
        
        data.push({
          date: dateStr,
          type: workoutType,
          completed,
        });
      }
      
      return data;
    };
    
    setWorkoutData(generateMockData());
  }, []);

  // Function to update workout data (called when workout is logged)
  const updateWorkoutData = (date: string, type: WorkoutType, completed: boolean) => {
    setWorkoutData(prevData => {
      const existingIndex = prevData.findIndex(workout => workout.date === date);
      const newWorkout = { date, type, completed };
      
      if (existingIndex >= 0) {
        // Update existing workout
        const updatedData = [...prevData];
        updatedData[existingIndex] = newWorkout;
        return updatedData;
      } else {
        // Add new workout
        return [...prevData, newWorkout];
      }
    });
  };

  // Function to get workout type for a specific date (for PPL rotation)
  const getWorkoutTypeForDate = (date: Date): WorkoutType => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // PPL rotation: Push, Pull, Legs, Rest, Push, Pull, Legs
    const pplRotation = ['rest', 'push', 'pull', 'legs', 'rest', 'push', 'pull'];
    return pplRotation[dayOfWeek] as WorkoutType;
  };

  // Function to handle day click
  const handleDayClick = (day: CalendarDay) => {
    if (day.isFuture) {
      // Show workout selection popup for future days
      setSelectedDate(day.date);
      setPopupOpen(true);
      return;
    }
    
    // Toggle workout completion for past days
    const dateStr = day.date.toISOString().split('T')[0];
    const workoutType = day.workoutType || getWorkoutTypeForDate(day.date);
    const newCompleted = !day.isCompleted;
    
    updateWorkoutData(dateStr, workoutType, newCompleted);
  };

  // Function to handle workout selection from popup
  const handleWorkoutSelect = (workoutType: 'push' | 'pull' | 'legs', date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    updateWorkoutData(dateStr, workoutType, true);
    setPopupOpen(false);
    setSelectedDate(null);
  };

  // Function to close popup
  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedDate(null);
  };

  const today = currentDate;
  const todayDay = today.getDate();
  const [activeDayValue, setActiveDayValue] = useState<number>(todayDay);

  // Update active day when date changes
  useEffect(() => {
    setActiveDayValue(todayDay);
  }, [todayDay]);

  const greeting = `Hi, Zarsko`;
  
  // Format date exactly like the design: "Today is DD, Month YYYY"
  const formatDate = (date: Date) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).formatToParts(date);

    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return `Today is ${day}, ${month} ${year}`;
  };

  const dateStr = formatDate(today);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const axisLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartValues = [120, 190, 240, 300, 505, 280, 260];

  // Helper function to get workout data for a specific date
  const getWorkoutForDate = (date: Date): WorkoutData | null => {
    const dateStr = date.toISOString().split('T')[0];
    return workoutData.find(workout => workout.date === dateStr) || null;
  };

  // Create calendar days centered around the current day (14 days total - 2 rows of 7)
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 3); // Start 3 days before today
    
    return Array.from({ length: 14 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      const value = currentDate.getDate();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isFuture = currentDate > today;
      const workout = getWorkoutForDate(currentDate);
      
      // For future days, use PPL rotation if no workout data exists
      let workoutType = workout?.type || null;
      if (isFuture && !workout) {
        workoutType = getWorkoutTypeForDate(currentDate);
      }
      
      return {
        value,
        isSelected: value === activeDayValue,
        isToday,
        date: new Date(currentDate),
        workoutType,
        isCompleted: workout?.completed || false,
        isFuture,
      };
    });
  }, [activeDayValue, today, workoutData]);

  const chartData = useMemo(
    () =>
      axisLabels.map((label, index) => ({
        dayLabel: label,
        axisLabel: label,
        value: chartValues[index],
      })),
    [axisLabels]
  );

  const activeChartIndex = 4; // Friday is highlighted in the Figma design (505 KG)
  const activeValueLabel = `505 KG`; // Hardcoded to match Figma

  const getDayClasses = (day: CalendarDay) => {
    // Today - always highlighted with pink (highest priority)
    if (day.isToday) {
      return 'border-0 bg-[#FAD7E0] text-[#271535] shadow-[0_8px_24px_rgba(250,215,224,0.4)]';
    }
    
    // Future days - empty circles with subtle border, clickable
    if (day.isFuture) {
      return 'border-white/20 text-white/40 bg-transparent hover:border-white/40 hover:bg-white/5 cursor-pointer transition-all duration-200';
    }
    
    // Past days with completed workouts
    if (day.workoutType && !day.isFuture && day.isCompleted) {
      const workoutColors = {
        push: 'bg-green-500 text-white',
        pull: 'bg-blue-500 text-white',
        legs: 'bg-purple-500 text-white',
        rest: 'bg-gray-500 text-white',
      };
      
      const baseClasses = 'border-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer';
      return `${baseClasses} ${workoutColors[day.workoutType]}`;
    }
    
    // Past days with planned but not completed workouts
    if (day.workoutType && !day.isFuture && !day.isCompleted) {
      const workoutColors = {
        push: 'bg-green-500/30 text-green-300 border-green-500/50',
        pull: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
        legs: 'bg-purple-500/30 text-purple-300 border-purple-500/50',
        rest: 'bg-gray-500/30 text-gray-300 border-gray-500/50',
      };
      
      const baseClasses = 'border shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer';
      return `${baseClasses} ${workoutColors[day.workoutType]}`;
    }
    
    // Selected day (not today)
    if (day.isSelected && !day.isToday) {
      return 'border-white/50 text-white bg-white/10 shadow-[0_4px_12px_rgba(255,255,255,0.1)] cursor-pointer';
    }
    
    // Default styling for days without workout data
    return 'border-white/30 text-white/65 hover:border-white/50 cursor-pointer';
  };

  return (
    <ScreenLayout contentClassName="flex flex-col h-full px-6 py-6 bg-gradient-to-br from-[#2B2440] via-[#1F1934] to-[#100B1F]">
      <header className="pt-4">
        <h1 className="text-[28px] font-bold leading-tight">
          {greeting}
        </h1>
        <p className="mt-1 text-[16px] text-white/80 font-normal">
          {dateStr}
        </p>
      </header>

      <section className="mt-8">
        <div className="flex justify-between mb-3">
          {weekDays.map((day, index) => (
            <div 
              key={day + index} 
              className="w-11 text-center text-[13px] font-medium uppercase text-white/60"
            >
              {day}
            </div>
          ))}
        </div>

        {/* First row of 7 days */}
        <div className="flex justify-between mb-2">
          {calendarDays.slice(0, 7).map((day) => (
            <button
              key={`day-${day.value}-${day.date.getMonth()}-${day.date.getDate()}`}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-bold transition-all duration-150 ${getDayClasses(day)}`}
              onClick={() => {
                setActiveDayValue(day.value);
                handleDayClick(day);
              }}
            >
              {day.value}
            </button>
          ))}
        </div>

        {/* Second row of 7 days */}
        <div className="flex justify-between">
          {calendarDays.slice(7, 14).map((day) => (
            <button
              key={`day-${day.value}-${day.date.getMonth()}-${day.date.getDate()}`}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-bold transition-all duration-150 ${getDayClasses(day)}`}
              onClick={() => {
                setActiveDayValue(day.value);
                handleDayClick(day);
              }}
            >
              {day.value}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10 flex-1">
        <DashboardWeightChart
          data={chartData}
          activeIndex={activeChartIndex}
          activeValueLabel={activeValueLabel}
          title="Push"
          description="20 reps, 3 sets with 10 sec rest"
        />
      </div>

      <BottomNavigation activeTab="home" className="mt-auto pt-5" />

      {/* Workout Selection Popup */}
      {selectedDate && (
        <WorkoutSelectionPopup
          isOpen={popupOpen}
          onClose={handleClosePopup}
          selectedDate={selectedDate}
          onWorkoutSelect={handleWorkoutSelect}
        />
      )}
    </ScreenLayout>
  );
};

export default Dashboard;