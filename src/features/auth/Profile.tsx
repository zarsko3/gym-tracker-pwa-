import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LogOut, User, Mail, Calendar, Trash2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleDeleteAllData = async () => {
    if (confirmText !== 'DELETE ALL WORKOUTS') {
      alert('Please type the confirmation text exactly');
      return;
    }
    
    setIsDeleting(true);
    try {
      const workoutsRef = collection(db, 'users', user!.uid, 'workouts');
      const snapshot = await getDocs(workoutsRef);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      
      alert(`Deleted ${snapshot.size} workouts`);
      setShowDeleteConfirm(false);
      setConfirmText('');
    } catch (error: any) {
      alert('Error deleting data: ' + error.message);
    } finally {
      setIsDeleting(false);
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

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-8">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                This will permanently delete all your workout data. This cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-ios-secondary bg-red-600 hover:bg-red-700"
                >
                  Delete All Workouts
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Type: DELETE ALL WORKOUTS"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="input-ios w-full"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDeleteAllData} 
                      disabled={isDeleting}
                      className="btn-ios bg-red-600 disabled:bg-gray-600"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)} 
                      className="btn-ios-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
