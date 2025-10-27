import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user.displayName || 'User'}
                </h2>
                <p className="text-gray-400">Gym Tracker User</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-400">Email</span>
                </div>
                <p className="text-white">{user.email}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-400">Member Since</span>
                </div>
                <p className="text-white">
                  {user.metadata.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
                  Notification Settings
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
                  Data Export
                </button>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">App Information</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Version: 1.0.0</p>
                <p>Build: PWA</p>
                <p>Platform: Web</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
