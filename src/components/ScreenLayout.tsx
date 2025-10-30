import React from 'react';

interface ScreenLayoutProps {
  children: React.ReactNode;
  contentClassName?: string;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  contentClassName = '',
}) => {
  return (
    <div className="w-full min-h-screen bg-[var(--color-primary)] py-4 flex items-center justify-center">
      <div className={`w-[390px] max-h-[844px] relative text-white font-sans overflow-hidden flex flex-col ${contentClassName}`} style={{ background: 'var(--color-primary)', height: 'min(844px, 100vh - 2rem)' }}>
        {children}
      </div>
    </div>
  );
};

export default ScreenLayout;

