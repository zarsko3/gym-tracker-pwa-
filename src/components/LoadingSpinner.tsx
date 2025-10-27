import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="spinner mb-4"></div>
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
