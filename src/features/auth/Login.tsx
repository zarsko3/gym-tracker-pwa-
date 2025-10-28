import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ArrowLeft } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout contentClassName="auth-entrance flex h-full flex-col px-6 py-8">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
      </div>

      <h1 className="mb-2 text-figma-h1 leading-tight">
        Welcome back!
      </h1>
      <p className="text-figma-body text-white/70 mb-8">
        Hello! Register to get started
      </p>

      <form onSubmit={handleLogin} className="space-y-4 flex-1">
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
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-figma-caption text-white/60 transition hover:text-white">
            Forgot Password?
          </Link>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-auto">
        <p className="text-center text-figma-body text-white/70">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-white transition hover:text-[#FAF0A1]">
            Register Now
          </Link>
        </p>
      </div>
    </ScreenLayout>
  );
};

export default Login;