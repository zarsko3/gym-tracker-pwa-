import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import DashboardWeightChart from '../dashboard/DashboardWeightChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const today = new Date();
  const todayDay = today.getDate();
  const initialDisplayDay = Math.min(todayDay, 14);
  const [activeDayValue, setActiveDayValue] = useState<number>(initialDisplayDay);

  const greeting = `Hi!,\n${user?.displayName || 'Zarsko'}`;
  const displayMonthName = today.toLocaleString('en-US', { month: 'long' });
  const displayYear = today.getFullYear();
  const dateStr = `${activeDayValue},${displayMonthName} ${displayYear}`;

  const dayAbbreviations = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const axisLabels = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
  const chartValues = [120, 190, 240, 300, 505, 280, 260];

  const calendarDays = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        value: index + 1,
        isSelected: index + 1 === activeDayValue,
        isToday: index + 1 === todayDay,
      })),
    [activeDayValue, todayDay]
  );

  const chartData = useMemo(
    () =>
      axisLabels.map((label, index) => ({
        dayLabel: label,
        axisLabel: label,
        value: chartValues[index],
      })),
    [axisLabels, chartValues]
  );

  const activeChartIndex = (activeDayValue - 1) % axisLabels.length;
  const activeValueLabel = `${chartValues[activeChartIndex]} KG`;

  const handleDaySelect = (value: number) => {
    setActiveDayValue(value);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#241D3F] via-[#1B1631] to-[#100B1F] text-white">
      <div className="absolute -top-48 -left-24 h-[360px] w-[360px] rounded-full bg-[#FFB8E0]/14 blur-3xl" />
      <div className="absolute -bottom-48 -right-24 h-[420px] w-[420px] rounded-full bg-[#7C6CF3]/12 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col px-8 pt-16 pb-12">
        <header>
          <h1 className="text-[28px] leading-[34px] font-semibold tracking-tight whitespace-pre-line">
            {greeting}
          </h1>
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/45">
            Today is
          </p>
          <p className="mt-2 text-[22px] font-semibold tracking-[0.02em] text-white">
            {dateStr}
          </p>
        </header>

        <section className="mt-10 space-y-5">
          <div className="grid grid-cols-7 gap-[18px] text-[12px] font-semibold uppercase tracking-[0.26em] text-white/45">
            {dayAbbreviations.map((abbr, index) => (
              <span key={abbr} className={index === 4 ? 'text-white' : ''}>
                {abbr}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 text-[13px] font-semibold">
            {calendarDays.slice(0, 7).map((day) => (
              <button
                key={`week-one-${day.value}`}
                type="button"
                className={`h-11 rounded-full border transition-all duration-150 ${
                  day.isSelected
                    ? 'border-0 bg-[#FFB8E0] text-[#271535] shadow-[0_12px_36px_rgba(255,184,224,0.35)]'
                    : day.isToday
                      ? 'border-white/60 text-white bg-white/5'
                      : 'border-white/35 text-white/75 hover:border-white/60'
                }`}
                onClick={() => handleDaySelect(day.value)}
              >
                {day.value}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 text-[13px] font-semibold">
            {calendarDays.slice(7, 14).map((day) => (
              <button
                key={`week-two-${day.value}`}
                type="button"
                className={`h-11 rounded-full border transition-all duration-150 ${
                  day.isToday
                    ? 'border-white/60 text-white bg-white/5'
                    : 'border-white/35 text-white/55 hover:border-white/60'
                }`}
                onClick={() => handleDaySelect(day.value)}
              >
                {day.value}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <DashboardWeightChart
            data={chartData}
            activeIndex={activeChartIndex}
            activeValueLabel={activeValueLabel}
          />
        </div>

        <BottomNavigation activeTab="home" className="mt-auto pt-10" />
      </div>
    </div>
  );
};

export default Dashboard;