import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ChevronLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[var(--color-primary)] px-6 py-12 relative overflow-hidden">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[#1a1526] opacity-80" />
      
      {/* Main content container */}
      <div className="relative z-10 auth-entrance">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 w-10 h-10 rounded-full bg-[var(--color-card-dark)] flex items-center justify-center hover:bg-[var(--color-card-light)] transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Title */}
        <h1 className="text-figma-h1 text-white mb-2">
          Forgot Password?
        </h1>

        {/* Subtitle */}
        <p className="text-figma-body text-[var(--color-text-secondary)] mb-8">
          Don't worry! It happens. Please enter the address associated with your account.
        </p>

        {/* Form */}
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
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-figma-primary w-full mt-6 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-figma-body text-[var(--color-text-secondary)] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-[var(--color-text-primary)] transition-colors duration-200">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;