import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[#1a1526] opacity-80" />
      
      {/* Main content container */}
      <div className={`relative z-10 flex flex-col items-center justify-center w-full max-w-[var(--welcome-max-width)] welcome-entrance`}>
        {/* Logo container with glassmorphism effect */}
        <div className="w-[var(--welcome-logo-size)] h-[var(--welcome-logo-size)] rounded-full glass-logo flex items-center justify-center mb-8 welcome-logo">
          <Dumbbell className="w-12 h-12 text-white" />
        </div>
        
        {/* Title with proper line breaks */}
        <h1 className="text-figma-h1 text-white text-center mb-6 leading-tight">
          Start your<br />Fitness Journey
        </h1>
        
        {/* Subtitle */}
        <p className="text-figma-body text-[var(--color-text-secondary)] text-center mb-12 leading-relaxed max-w-xs">
          Transform your body and mind with personalized workouts designed just for you
        </p>
        
        {/* Button container */}
        <div className="w-full space-y-4">
          {/* Primary CTA - Register */}
          <button
            onClick={() => navigate('/signup')}
            className="btn-figma-primary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Register
          </button>
          
          {/* Secondary CTA - Login */}
          <button
            onClick={() => navigate('/login')}
            className="btn-figma-secondary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Login
          </button>
          
          {/* Tertiary CTA - Continue as guest */}
          <button
            onClick={() => navigate('/dashboard')}
            className="text-figma-body text-white/80 hover:text-white underline hover:no-underline transition-all duration-200 mt-6 w-full py-2"
          >
            Continue as a guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
