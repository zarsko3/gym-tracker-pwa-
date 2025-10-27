import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { DEFAULT_TEMPLATES, type WorkoutTemplate } from '../../services/templates';
import { Plus, Edit, Trash2, Check } from 'lucide-react';

const Templates: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load default templates
    const defaultTemplates = Object.values(DEFAULT_TEMPLATES);
    
    // Load user's custom templates
    const q = query(
      collection(db, 'templates'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customTemplates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkoutTemplate[];

      setTemplates([...defaultTemplates, ...customTemplates]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateTemplate = async (templateData: Omit<WorkoutTemplate, 'id'>) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'templates'), {
        ...templateData,
        userId: user.uid,
        createdAt: new Date()
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Workout Templates</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                </div>
                {template.id.startsWith('user-') && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {Object.entries(template.workouts).map(([workoutType, exercises]) => (
                  <div key={workoutType}>
                    <h4 className="text-sm font-medium text-indigo-400 mb-2">{workoutType}</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {exercises.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {exercise}
                        </li>
                      ))}
                      {exercises.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          +{exercises.length - 3} more exercises
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {showCreateForm && (
          <TemplateForm
            template={editingTemplate}
            onSubmit={handleCreateTemplate}
            onClose={() => {
              setShowCreateForm(false);
              setEditingTemplate(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface TemplateFormProps {
  template?: WorkoutTemplate | null;
  onSubmit: (template: Omit<WorkoutTemplate, 'id'>) => void;
  onClose: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    workouts: template?.workouts || { 'Workout 1': [] }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addWorkout = () => {
    const workoutNumber = Object.keys(formData.workouts).length + 1;
    setFormData({
      ...formData,
      workouts: {
        ...formData.workouts,
        [`Workout ${workoutNumber}`]: []
      }
    });
  };

  const updateWorkoutName = (oldName: string, newName: string) => {
    const { [oldName]: oldWorkout, ...rest } = formData.workouts;
    setFormData({
      ...formData,
      workouts: {
        ...rest,
        [newName]: oldWorkout
      }
    });
  };

  const addExercise = (workoutName: string) => {
    setFormData({
      ...formData,
      workouts: {
        ...formData.workouts,
        [workoutName]: [...formData.workouts[workoutName], '']
      }
    });
  };

  const updateExercise = (workoutName: string, index: number, value: string) => {
    const updatedExercises = [...formData.workouts[workoutName]];
    updatedExercises[index] = value;
    setFormData({
      ...formData,
      workouts: {
        ...formData.workouts,
        [workoutName]: updatedExercises
      }
    });
  };

  const removeExercise = (workoutName: string, index: number) => {
    const updatedExercises = formData.workouts[workoutName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      workouts: {
        ...formData.workouts,
        [workoutName]: updatedExercises
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          {template ? 'Edit Template' : 'Create Template'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Workouts
              </label>
              <button
                type="button"
                onClick={addWorkout}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
              >
                Add Workout
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(formData.workouts).map(([workoutName, exercises]) => (
                <div key={workoutName} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={workoutName}
                      onChange={(e) => updateWorkoutName(workoutName, e.target.value)}
                      className="text-lg font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => addExercise(workoutName)}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                    >
                      Add Exercise
                    </button>
                  </div>

                  <div className="space-y-2">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={exercise}
                          onChange={(e) => updateExercise(workoutName, index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Exercise name"
                        />
                        <button
                          type="button"
                          onClick={() => removeExercise(workoutName, index)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              {template ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Templates;
