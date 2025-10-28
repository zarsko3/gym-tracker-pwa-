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
      <div className="flex items-center justify-between rounded-[36px] bg-[rgba(32,24,52,0.85)] px-7 py-5 shadow-[0_22px_52px_rgba(6,2,25,0.45)] backdrop-blur-lg w-full max-w-[390px]">
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
              <div className={`grid h-[52px] w-[52px] place-items-center rounded-full border ${
                isActive
                  ? 'border-white bg-white text-[#251B3D] shadow-[0_12px_30px_rgba(255,255,255,0.38)]'
                  : 'border-white/8 bg-white/5 text-white/65'
              }`}>
                <Icon className={`h-[20px] w-[20px]`} strokeWidth={1.6} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
