import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Activity, Flame, TrendingUp } from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  workoutType: string;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'push',
    name: 'Push',
    icon: Dumbbell,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    workoutType: 'Push',
    description: 'Chest, shoulders, triceps'
  },
  {
    id: 'pull',
    name: 'Pull',
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    workoutType: 'Pull',
    description: 'Back, biceps, rear delts'
  },
  {
    id: 'legs',
    name: 'Legs',
    icon: Activity,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    workoutType: 'Legs',
    description: 'Quads, hamstrings, calves'
  },
  {
    id: 'warmup',
    name: 'Warm-up',
    icon: Flame,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    workoutType: 'Warmup',
    description: 'Mobility & activation'
  }
];

interface CategoryCardsProps {
  workouts: Record<string, WorkoutData>;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ workouts }) => {
  const navigate = useNavigate();

  const getCategoryStats = (workoutType: string) => {
    const categoryWorkouts = Object.values(workouts).filter(
      w => w.workoutType === workoutType
    );
    const last30Days = categoryWorkouts.filter(w => {
      const date = new Date(w.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });
    return last30Days.length;
  };

  const handleCategoryClick = (category: Category) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/workout/${today}?type=${category.workoutType}`);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-md text-white">Categories</h3>
        <button className="text-sm text-indigo-400 hover:text-indigo-300">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => {
          const recentWorkouts = getCategoryStats(category.workoutType);
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="card-modern p-4 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-6 h-6 ${category.color}`} />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">
                {category.name}
              </h4>
              <p className="text-xs text-gray-400 mb-2">
                {category.description}
              </p>
              <p className="text-xs text-gray-500">
                {recentWorkouts} workouts this month
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;
