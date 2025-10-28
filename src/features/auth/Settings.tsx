import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Shield, LogOut, Edit3, HelpCircle, Type } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';
import ScreenLayout from '../../components/ScreenLayout';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const appSettingsItems = [
    { icon: User, label: 'Account Informations', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Type, label: 'Text Size', action: () => {} },
  ];

  const supportItems = [
    { icon: Shield, label: 'Privacy Policy', action: () => {} },
    { icon: HelpCircle, label: 'Terms Of Service', action: () => {} },
  ];

  return (
    <ScreenLayout contentClassName="flex h-full flex-col px-6 pt-[86px] pb-10">
      <div className="mb-8">
        <h1 className="text-figma-h1">Settings</h1>
      </div>

      <div className="mb-8">
        <div className="card-figma">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-pink)]">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-figma-h3 text-white">{user?.displayName || 'User'}</h3>
              <div className="flex gap-4 text-figma-caption text-white/60">
                <span>175 cm</span>
                <span>70 kg</span>
              </div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Edit3 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-figma-h3">App Settings</h2>
        <div className="space-y-3">
          {appSettingsItems.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              onClick={action}
              className="glass-card flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-figma-body text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-figma-h3">Support</h2>
        <div className="space-y-3">
          {supportItems.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              onClick={action}
              className="glass-card flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-figma-body text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="glass-card flex w-full items-center gap-4 border border-red-500/20 p-4 text-left transition hover:bg-red-500/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
            <LogOut className="h-5 w-5 text-red-400" />
          </div>
          <span className="text-figma-body text-red-400">Logout</span>
        </button>
      </div>

      <BottomNavigation activeTab="settings" className="mt-auto pt-10" />
    </ScreenLayout>
  );
};

export default Settings;
