import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

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
    <ScreenLayout contentClassName="auth-entrance flex h-full flex-col px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <h1 className="mb-2 text-figma-h1">OTP Verification</h1>

      <p className="mb-8 text-figma-body text-white/70">
        We have sent a verification code to
        <br />
        <span className="font-semibold text-white">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-12 w-12 rounded-lg border border-white/20 bg-white/10 text-center text-2xl font-bold text-white transition focus:border-white focus:outline-none"
              required
            />
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-3">
            <p className="text-center text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 4}
          className="btn-figma-primary mt-6 w-full transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-figma-body font-semibold text-white transition hover:text-[#FAF0A1] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Didn't receive code? Resend
          </button>
        ) : (
          <p className="text-figma-body text-white/70">
            Resend code in {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </ScreenLayout>
  );
};

export default OTPVerification;