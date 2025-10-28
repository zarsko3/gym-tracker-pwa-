import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or use a default
  const email = location.state?.email || 'your email';
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    setError('');
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 4-digit code
      if (otpString.length === 4) {
        navigate('/password-changed', { state: { email } });
      } else {
        setError('Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          OTP Verification
        </h1>

        {/* Subtitle */}
        <p className="text-figma-body text-[var(--color-text-secondary)] mb-8">
          We have sent a verification code to<br />
          <span className="text-white font-semibold">{email}</span>
        </p>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold bg-[var(--color-card-dark)] border border-[var(--color-strokes)] rounded-lg text-white focus:border-white focus:outline-none transition-all duration-200"
                required
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 4}
            className="btn-figma-primary w-full mt-6 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Resend section */}
        <div className="text-center mt-6">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-figma-body text-white font-semibold hover:text-[var(--color-text-primary)] transition-colors duration-200 disabled:opacity-50"
            >
              Didn't receive code? Resend
            </button>
          ) : (
            <p className="text-figma-body text-[var(--color-text-secondary)]">
              Resend code in {formatTime(timeLeft)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;