import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadWorkoutData, getWorkoutStats } from '../../utils/uploadWorkoutData';
import { Upload, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

const DataUpload: React.FC = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleUpload = async () => {
    if (!user) {
      setUploadResult({ success: false, error: 'Please log in first' });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadWorkoutData(user.uid);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const stats = getWorkoutStats();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload Workout Data
          </h1>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              This will upload your historical workout data from September 8, 2025 to October 27, 2025 
              into your account. The data includes all your Push, Pull, and Legs workouts with weights and equipment used.
            </p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Data Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Total Workout Days</div>
                  <div className="text-xl font-bold text-white">{stats.totalDays}</div>
                </div>
                <div>
                  <div className="text-gray-400">Total Exercises</div>
                  <div className="text-xl font-bold text-white">{stats.totalExercises}</div>
                </div>
                <div>
                  <div className="text-gray-400">Total Sets</div>
                  <div className="text-xl font-bold text-white">{stats.totalSets}</div>
                </div>
                <div>
                  <div className="text-gray-400">Workout Types</div>
                  <div className="text-sm text-white">
                    Push: {stats.byType.Push || 0}, Pull: {stats.byType.Pull || 0}, Legs: {stats.byType.Legs || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleUpload}
              disabled={uploading || !user}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Workout Data
                </>
              )}
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              {showStats ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {uploadResult && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              uploadResult.success 
                ? 'bg-green-900/30 border border-green-500/50' 
                : 'bg-red-900/30 border border-red-500/50'
            }`}>
              {uploadResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <div className={`font-semibold ${
                  uploadResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
                </div>
                <div className="text-sm text-gray-300">
                  {uploadResult.success 
                    ? `Successfully uploaded ${uploadResult.count} workout days to your account.`
                    : uploadResult.error
                  }
                </div>
              </div>
            </div>
          )}

          {showStats && (
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Detailed Workout Breakdown</h3>
              <div className="space-y-3">
                {stats.byType.Push && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-white">Push Workouts: {stats.byType.Push} days</span>
                  </div>
                )}
                {stats.byType.Pull && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-white">Pull Workouts: {stats.byType.Pull} days</span>
                  </div>
                )}
                {stats.byType.Legs && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-white">Legs Workouts: {stats.byType.Legs} days</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-400">
                <p>• All historical data will be marked as completed</p>
                <p>• Equipment and notes are preserved from your original log</p>
                <p>• Data will appear in your calendar and progress charts</p>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="font-semibold text-yellow-400">Authentication Required</div>
                  <div className="text-sm text-gray-300">
                    Please log in to your account to upload workout data.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
