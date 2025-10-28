import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ChevronLeft } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/onboarding-step1');
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

      <h1 className="mb-2 text-figma-h1 leading-tight">
        Hello! Register to get
        <br />started
      </h1>

      <form onSubmit={handleSignup} className="mt-8 space-y-5">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-figma w-full"
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-figma w-full"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-figma w-full"
            required
          />
        </div>

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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-figma-body text-white/70">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-white transition hover:text-[#FAF0A1]">
          Login Now
        </Link>
      </p>
    </ScreenLayout>
  );
};

export default Signup;