import React from 'react';

interface ScreenLayoutProps {
  children: React.ReactNode;
  contentClassName?: string;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  contentClassName = 'flex h-full flex-col px-6 py-8',
}) => {
  return (
    <div className={`fixed inset-0 w-full h-full bg-[#1B1631] text-white overflow-hidden ${contentClassName}`}>
      {children}
    </div>
  );
};

export default ScreenLayout;

