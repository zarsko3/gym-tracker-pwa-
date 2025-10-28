import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PasswordChanged: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state
  const email = location.state?.email || 'your account';

  return (
    <div className="min-h-screen bg-[var(--color-primary)] px-6 py-12 relative overflow-hidden">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[#1a1526] opacity-80" />
      
      {/* Main content container */}
      <div className="relative z-10 auth-entrance">
        {/* Success content */}
        <div className="text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          
          {/* Title */}
          <h1 className="text-figma-h1 text-white mb-4">
            Password Changed!
          </h1>
          
          {/* Success message */}
          <p className="text-figma-body text-[var(--color-text-secondary)] mb-12 leading-relaxed">
            Your password has been successfully changed.<br />
            You can now log in with your new password.
          </p>
          
          {/* Back to Login button */}
          <button
            onClick={() => navigate('/login')}
            className="btn-figma-primary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChanged;