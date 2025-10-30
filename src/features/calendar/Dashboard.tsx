import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
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
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<string | null>(null);

  // Update date every minute to handle day changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Load workout data from Firebase
  useEffect(() => {
    if (!user) {
      setWorkoutData([]);
      return;
    }

    const workoutsRef = collection(db, 'users', user.uid, 'workouts');
    const q = query(workoutsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workouts: WorkoutData[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          date: doc.id, // Document ID is the date string
          type: data.workoutType as WorkoutType,
          completed: data.completed || false,
        };
      });
      
      setWorkoutData(workouts);
      console.log('Loaded workouts from Firebase:', workouts);
    });

    return () => unsubscribe();
  }, [user]);

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

  // Function to delete a workout
  const deleteWorkout = async (date: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'workouts', date));
      console.log('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (date: string) => {
    setDateToDelete(date);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (dateToDelete) {
      deleteWorkout(dateToDelete);
      setShowDeleteConfirm(false);
      setDateToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDateToDelete(null);
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
    // Always set selected date for displaying workout details
    setSelectedDate(day.date);
    
    // For today and future days, show workout selection popup
    if (day.isToday || day.isFuture) {
      setPopupOpen(true);
      return;
    }
    
    // For past days, toggle workout completion
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
    const baseTransition = 'transition-all duration-200 hover:scale-103 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#1F1934]';
    
    // Today - thicker ring + subtle glow (only show if completed)
    if (day.isToday) {
      if (day.isCompleted) {
        // Today with completed workout: soft gradient with elegant glow
        return `border-0 bg-gradient-to-br from-[#E8D5FF] to-[#D4C5F9] text-[#2B2440] font-extrabold shadow-[0_0_20px_rgba(232,213,255,0.25),0_4px_16px_rgba(0,0,0,0.15)] cursor-pointer ${baseTransition}`;
      } else {
        // Today without completion: soft ring with subtle background
        return `border-[2px] border-[#C5B3E6] bg-[#C5B3E6]/10 text-[#E8D5FF] font-extrabold shadow-[0_0_16px_rgba(197,179,230,0.2)] cursor-pointer ${baseTransition}`;
      }
    }
    
    // Past/future days: only show if completed
    if (day.isCompleted) {
      return `border-0 bg-white/15 text-white/90 font-semibold shadow-[0_4px_12px_rgba(255,255,255,0.08)] backdrop-blur-sm cursor-pointer ${baseTransition}`;
    }
    
    // Empty circle for all non-completed days
    return `border border-white/15 bg-transparent text-white/60 hover:border-white/30 hover:bg-white/5 hover:text-white/80 cursor-pointer ${baseTransition}`;
  };

  return (
    <ScreenLayout contentClassName="bg-gradient-to-br from-[#2B2440] via-[#1F1934] to-[#100B1F]">
      <div className="flex-1 overflow-y-auto px-6 py-6">
      <header className="pt-4">
        <h1 className="text-[28px] font-bold leading-tight">
          {greeting}
        </h1>
        <p className="mt-1 text-[16px] text-white/80 font-normal">
          {dateStr}
        </p>
      </header>

      <section className="mt-8">
        <div className="flex justify-between gap-2 mb-4">
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
        <div className="flex justify-between gap-2 mb-4">
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
        <div className="flex justify-between gap-2">
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

      <div className="mt-8 flex-1">
        {/* Selected Day Workout Details */}
        {selectedDate && (() => {
          const dateStr = selectedDate.toISOString().split('T')[0];
          const workout = workoutData.find(w => w.date === dateStr);
          const hasWorkout = workout && workout.type && workout.type !== 'rest';
          
          if (hasWorkout) {
            return (
              <div className="mb-6 rounded-2xl bg-white/8 ring-1 ring-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8D5FF]/15 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-[#E8D5FF]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize">{workout.type} Workout</p>
                      <p className="text-white/60 text-sm">
                        {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(dateStr)}
                    className="w-9 h-9 rounded-xl bg-red-400/15 flex items-center justify-center text-red-300 hover:bg-red-400/25 transition-colors"
                    aria-label="Delete workout"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div className="mb-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 backdrop-blur text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-white/40" />
                </div>
                <p className="text-white/70 text-sm mb-3">No workout scheduled</p>
                <button
                  onClick={() => setPopupOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E8D5FF] to-[#D4C5F9] text-[#2B2440] font-semibold hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Workout
                </button>
              </div>
            );
          }
        })()}
        
        <DashboardWeightChart
          data={chartData}
          activeIndex={activeChartIndex}
          activeValueLabel={activeValueLabel}
          title="Push"
          description="20 reps, 3 sets with 10 sec rest"
        />
      </div>
      </div>

      <BottomNavigation activeTab="home" className="flex-shrink-0 px-6 pb-6 pt-4" />

      {/* Workout Selection Popup */}
      {selectedDate && (
        <WorkoutSelectionPopup
          isOpen={popupOpen}
          onClose={handleClosePopup}
          selectedDate={selectedDate}
          onWorkoutSelect={handleWorkoutSelect}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-sm mx-auto transform transition-all">
            <div className="bg-[#2B2440] rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-lg">
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Delete Workout?
              </h3>
              <p className="text-white/70 text-sm text-center mb-6">
                This will remove the workout from your schedule. This action cannot be undone.
              </p>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};

export default Dashboard;