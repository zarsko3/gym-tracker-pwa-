import React from 'react';
import { Plus } from 'lucide-react';

interface AddSetButtonProps {
  onAddSet: () => void;
}

const AddSetButton: React.FC<AddSetButtonProps> = ({ onAddSet }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onAddSet}
        className="flex items-center justify-center px-4 py-2 rounded-full bg-white text-[var(--color-primary)] font-medium transition-transform hover:scale-105 shadow-md"
        aria-label="Add set"
      >
        <Plus size={18} className="mr-2" />
        <span>Add Set</span>
      </button>
    </div>
  );
};

export default AddSetButton;
