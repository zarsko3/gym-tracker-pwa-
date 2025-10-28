import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const PasswordChanged: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state
  const email = location.state?.email || 'your account';

  return (
    <ScreenLayout contentClassName="auth-entrance flex h-full flex-col px-6 py-12">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>

        <h1 className="mb-4 text-figma-h1">Password Changed!</h1>

        <p className="mb-12 text-figma-body text-white/70">
          Your password has been successfully changed.
          <br />You can now log in with your new password.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="btn-figma-primary w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Back to Login
        </button>
      </div>
    </ScreenLayout>
  );
};

export default PasswordChanged;