import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Shield, LogOut, Edit3, Settings as SettingsIcon, HelpCircle, Type } from 'lucide-react';
import BottomNavigation from '../../components/BottomNavigation';

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
    <div className="min-h-screen bg-[var(--color-primary)] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-figma-h1 text-white mb-1">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="px-6 mb-8">
        <div className="card-figma">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-pink)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-figma-h3 text-white mb-1">{user?.displayName || 'User'}</h3>
              <div className="flex gap-4 text-figma-caption text-[var(--color-text-secondary)]">
                <span>175 cm</span>
                <span>70 kg</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* App Settings Section */}
      <div className="px-6 mb-6">
        <h2 className="text-figma-h3 text-white mb-4">App Settings</h2>
        <div className="space-y-3">
          {appSettingsItems.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              onClick={action}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:bg-[var(--color-card-light)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-figma-body text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="px-6 mb-6">
        <h2 className="text-figma-h3 text-white mb-4">Support</h2>
        <div className="space-y-3">
          {supportItems.map(({ icon: Icon, label, action }, index) => (
            <button
              key={index}
              onClick={action}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:bg-[var(--color-card-light)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-card-light)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-figma-body text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6">
        <button
          onClick={handleLogout}
          className="w-full glass-card p-4 flex items-center gap-4 text-left border border-red-500/20 hover:bg-red-500/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-figma-body text-red-400">Logout</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" />
    </div>
  );
};

export default Settings;
