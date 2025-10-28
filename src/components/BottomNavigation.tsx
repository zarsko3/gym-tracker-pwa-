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
      <div className="flex items-center justify-between rounded-[36px] bg-[rgba(42,32,63,0.85)] px-6 py-5 shadow-[0_24px_60px_rgba(6,2,25,0.45)] backdrop-blur">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={path}
              to={path}
              className={`mx-2 flex flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                isActive ? 'text-white' : 'text-white/35'
              }`}
            >
              <div className={`grid h-12 w-12 place-items-center rounded-full border ${
                isActive
                  ? 'border-white bg-white text-[#251B3D] shadow-[0_10px_28px_rgba(255,255,255,0.35)]'
                  : 'border-white/10 bg-[rgba(255,255,255,0.05)] text-white'
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? '' : 'text-white/65'}`} strokeWidth={1.6} />
              </div>
              <span className="hidden text-[10px] tracking-[0.24em]">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
