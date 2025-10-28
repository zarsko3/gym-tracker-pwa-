import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Calendar, BarChart3, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, className = '' }) => {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: LayoutGrid, label: 'Home' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/statistics', icon: BarChart3, label: 'Statistics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center justify-between rounded-[32px] bg-[rgba(32,24,52,0.9)] px-6 py-4 shadow-[0_16px_40px_rgba(6,2,25,0.4)] backdrop-blur-lg w-full max-w-[390px]">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = 
            (activeTab === 'home' && path === '/dashboard') ||
            (path !== '/dashboard' && location.pathname === path);
          
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center"
            >
              <div className={`grid h-[48px] w-[48px] place-items-center rounded-full border ${
                isActive
                  ? 'border-white bg-white text-[#251B3D] shadow-[0_8px_24px_rgba(255,255,255,0.35)]'
                  : 'border-white/10 bg-white/5 text-white/60'
              }`}>
                <Icon className={`h-[18px] w-[18px]`} strokeWidth={1.8} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
