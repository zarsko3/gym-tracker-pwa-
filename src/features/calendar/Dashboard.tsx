import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import DashboardWeightChart from '../dashboard/DashboardWeightChart';
import ScreenLayout from '../../components/ScreenLayout';

interface CalendarDay {
  value: number;
  isSelected: boolean;
  isToday: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Fixed date to match Figma design: December 11, 2022
  const today = new Date(2022, 11, 11); // Month is 0-indexed, so 11 = December
  const todayDay = today.getDate();
  const [activeDayValue, setActiveDayValue] = useState<number>(todayDay);

  const greeting = `Hi, Zarsko`;
  const displayMonthName = today.toLocaleString('en-US', { month: 'long' });
  const displayYear = today.getFullYear();
  const dateStr = `${todayDay}, ${displayMonthName} ${displayYear}`;

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const axisLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartValues = [120, 190, 240, 300, 505, 280, 260];

  // Create calendar days centered around the current day
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 3); // Start 3 days before today
    
    return Array.from({ length: 7 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      const value = currentDate.getDate();
      return {
        value,
        isSelected: value === activeDayValue,
        isToday: value === todayDay,
      };
    });
  }, [activeDayValue, todayDay]);

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
    if (day.isSelected || day.isToday) {
      return 'border-0 bg-[#FFB8E0] text-[#271535] shadow-[0_12px_36px_rgba(255,184,224,0.35)]';
    }
    return 'border-white/30 text-white/65 hover:border-white/55';
  };

  return (
    <ScreenLayout contentClassName="flex flex-col h-full px-6 py-8 bg-gradient-to-br from-[#2B2440] via-[#1F1934] to-[#100B1F]">
      <header className="mt-1">
        <h1 className="text-[26px] font-semibold leading-tight">
          {greeting}
        </h1>
        <p className="mt-2 text-[16px] text-white/80">
          Today is {dateStr}
        </p>
      </header>

      <section className="mt-10">
        <div className="flex justify-between mb-2">
          {weekDays.map((day, index) => (
            <div 
              key={day + index} 
              className="w-10 text-center text-[13px] font-medium uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {calendarDays.map((day) => (
            <button
              key={`day-${day.value}`}
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-[14px] font-semibold transition-all duration-150 ${getDayClasses(day)}`}
              onClick={() => setActiveDayValue(day.value)}
            >
              {day.value}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-12 flex-1">
        <DashboardWeightChart
          data={chartData}
          activeIndex={activeChartIndex}
          activeValueLabel={activeValueLabel}
          title="Push"
          description="20 reps, 3 sets with 10 sec rest"
        />
      </div>

      <BottomNavigation activeTab="home" className="mt-auto pt-6" />
    </ScreenLayout>
  );
};

export default Dashboard;