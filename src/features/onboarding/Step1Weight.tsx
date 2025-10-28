import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScreenLayout from '../../components/ScreenLayout';

const Step1Weight: React.FC = () => {
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const navigate = useNavigate();

  return (
    <ScreenLayout contentClassName="flex h-full flex-col px-6 py-12 text-white">
      <div className="mb-8 flex justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white" />
        <div className="h-2 w-2 rounded-full bg-white/30" />
      </div>

      <h1 className="mb-2 text-center text-[24px] font-semibold leading-[28px] tracking-tight">
        What is your
        <br />weight?
      </h1>

      <div className="mb-8 flex justify-center gap-2">
        <button
          onClick={() => setUnit('kg')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition ${
            unit === 'kg' ? 'bg-white text-[#251B3D]' : 'bg-white/10 text-white/70'
          }`}
        >
          KG
        </button>
        <button
          onClick={() => setUnit('lbs')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition ${
            unit === 'lbs' ? 'bg-white text-[#251B3D]' : 'bg-white/10 text-white/70'
          }`}
        >
          LBS
        </button>
      </div>

      <div className="relative mx-auto mb-10 flex h-80 w-80 items-center justify-center rounded-[36px] bg-[rgba(255,255,255,0.06)]">
        <div className="text-center">
          <div className="mb-2 text-6xl font-bold">{weight}</div>
          <div className="text-xl uppercase text-white/60">{unit}</div>
        </div>
        <div className="pointer-events-none absolute inset-0">
          {[40, 60, 80, 100, 120, 140, 160, 180].map((mark, i) => (
            <div
              key={mark}
              className="absolute text-xs font-medium text-white/40"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-140px)`,
                left: '50%',
                top: '50%',
              }}
            >
              {mark}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-sm items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => navigate('/onboarding-step2')}
          className="ml-4 flex flex-1 items-center justify-between rounded-full bg-white py-4 px-8 text-[#251B3D]"
        >
          <span className="text-figma-body font-semibold">Next</span>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </ScreenLayout>
  );
};

export default Step1Weight;
