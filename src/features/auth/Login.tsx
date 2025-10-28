import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { ChevronLeft } from 'lucide-react';

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
          Welcome back! Glad<br />to see you, Again!
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
            <Link to="/forgot-password" className="text-figma-caption text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200">
              Forgot Password?
            </Link>
          </div>

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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-figma-body text-[var(--color-text-secondary)] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-semibold hover:text-[var(--color-text-primary)] transition-colors duration-200">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;