import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Step2Height: React.FC = () => {
  const [height, setHeight] = useState(170);
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-8">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
      </div>

      <h1 className="text-figma-h2 text-[var(--color-primary)] text-center mb-2">
        What is your<br />height?
      </h1>

      {/* Unit Toggle */}
      <div className="flex gap-2 justify-center mb-8">
        <button
          onClick={() => setUnit('cm')}
          className={`px-6 py-2 rounded-full text-sm font-medium ${
            unit === 'cm' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-gray-600'
          }`}
        >
          CM
        </button>
        <button
          onClick={() => setUnit('ft')}
          className={`px-6 py-2 rounded-full text-sm font-medium ${
            unit === 'ft' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-gray-600'
          }`}
        >
          FT
        </button>
      </div>

      {/* Circular Height Picker - Light Blue */}
      <div className="relative w-80 h-80 mx-auto mb-8 bg-blue-200 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-[var(--color-primary)] mb-2">
            {height}
          </div>
          <div className="text-xl text-[var(--color-primary)] opacity-60">
            {unit}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--color-primary)]" />
        </button>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 ml-4 bg-[var(--color-primary)] text-white rounded-full py-4 px-8 flex items-center justify-between"
        >
          <span className="text-figma-body font-semibold">Next</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Step2Height;
