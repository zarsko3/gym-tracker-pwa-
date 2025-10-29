import React from 'react';

interface ExerciseTitleProps {
  title: string;
}

const ExerciseTitle: React.FC<ExerciseTitleProps> = ({ title }) => {
  return (
    <div className="mt-16 text-center">
      <h1 
        className="text-figma-h2 text-[var(--color-text-primary)]"
      >
        {title}
      </h1>
    </div>
  );
};

export default ExerciseTitle;
