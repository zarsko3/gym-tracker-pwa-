import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BarChart3, User, Upload, Home } from 'lucide-react';

interface iOSNavigationProps {
  className?: string;
}

const IOSNavigation: React.FC<iOSNavigationProps> = ({ className = '' }) => {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/upload-data', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`bg-gray-800 border-t border-gray-700 tabbar ${className}`}>
      <div className="flex justify-around">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={path}
              to={path}
              className={`tab-ios ${isActive ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="w-6 h-6" />
                <span className="text-xs sm:text-sm">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default IOSNavigation;
