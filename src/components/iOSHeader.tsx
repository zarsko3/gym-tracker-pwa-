import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, Settings } from 'lucide-react';

interface iOSHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

const IOSHeader: React.FC<iOSHeaderProps> = ({ 
  title, 
  showBack = false, 
  onBack, 
  rightAction,
  className = '' 
}) => {
  return (
    <header className={`nav-ios ${className}`}>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack}
              className="btn-ios-stepper w-11 h-11"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {rightAction || (
            <Link
              to="/templates"
              className="btn-ios-stepper w-11 h-11"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default IOSHeader;
