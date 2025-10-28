import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ChevronLeft } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      // Navigate to OTP Verification instead of showing success
      navigate('/otp-verification', { state: { email } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScreenLayout contentClassName="auth-entrance flex h-full flex-col px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <h1 className="mb-2 text-figma-h1">Forgot Password?</h1>

      <p className="mb-8 text-figma-body text-white/70">
        Don't worry! It happens. Please enter the address associated with your account.
      </p>

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-figma w-full"
          required
        />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-figma-primary mt-6 w-full transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Sending...' : 'Send Code'}
        </button>
      </form>

      <p className="mt-6 text-center text-figma-body text-white/70">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-white transition hover:text-[#FAF0A1]">
          Login Now
        </Link>
      </p>
    </ScreenLayout>
  );
};

export default ForgotPassword;