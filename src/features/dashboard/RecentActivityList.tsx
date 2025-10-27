import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar } from 'lucide-react';

interface WorkoutData {
  date: string;
  workoutType: string;
  templateId: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: number;
      weight: number;
      completed?: boolean;
    }>;
  }>;
}

interface RecentActivityListProps {
  workouts: Record<string, WorkoutData>;
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ workouts }) => {
  const navigate = useNavigate();
  
  const recentWorkouts = Object.entries(workouts)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {recentWorkouts.map(([date, workout]) => (
        <button
          key={date}
          onClick={() => navigate(`/workout/${date}`)}
          className="w-full text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-white">
              {workout.workoutType}
            </p>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </button>
      ))}
    </div>
  );
};

export default RecentActivityList;
