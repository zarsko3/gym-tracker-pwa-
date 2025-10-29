import React, { useState } from 'react';

interface WeightSliderProps {
  weight: number;
  onChange: (weight: number) => void;
}

const WeightSlider: React.FC<WeightSliderProps> = ({ weight, onChange }) => {
  const [localWeight, setLocalWeight] = useState(weight);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalWeight(value);
  };
  
  const handleChangeEnd = () => {
    onChange(localWeight);
  };
  
  return (
    <div className="flex flex-col items-center space-y-1 flex-1 ml-4">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-[var(--color-text-secondary)]">Weight</span>
        <div className="flex items-baseline">
          <span className="text-xl font-bold text-white mr-1">{localWeight}</span>
          <span className="text-sm text-[var(--color-text-secondary)]">kg</span>
        </div>
      </div>
      
      <div className="w-full px-1">
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="2.5"
          value={localWeight}
          onChange={handleChange}
          onMouseUp={handleChangeEnd}
          onTouchEnd={handleChangeEnd}
          className="w-full slider"
          aria-label="Weight slider"
        />
      </div>
    </div>
  );
};

export default WeightSlider;
