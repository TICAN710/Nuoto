import React, { useState } from 'react';
import { Activity, Calendar, Clock, Target, Edit2, Trash2, Check, X } from 'lucide-react';
import { Workout } from '../types/training';
import { formatDate } from '../utils/formatters';
import { WorkoutForm } from './WorkoutForm';
import { updateWorkout, deleteWorkout } from '../utils/storage';
import { ShareButton } from './ShareButton';
import { createShareableWorkout } from '../utils/sharing';

interface WorkoutsListProps {
  workouts: Workout[];
  onUpdate: () => void;
}

const workoutTypeColors = {
  technique: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  endurance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  speed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  recovery: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  mixed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export function WorkoutsList({ workouts, onUpdate }: WorkoutsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (workoutData: Omit<Workout, 'id'>) => {
    if (editingId) {
      updateWorkout(editingId, workoutData);
      setEditingId(null);
      onUpdate();
    }
  };

  const handleDelete = (id: string) => {
    deleteWorkout(id);
    setDeletingId(null);
    onUpdate();
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">No workouts logged yet</p>
        <p className="text-sm">Start tracking your training sessions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedWorkouts.map((workout) => (
        <div key={workout.id}>
          {editingId === workout.id ? (
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg border-2 border-teal-200 dark:border-teal-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-teal-900 dark:text-teal-100">Edit Workout</h4>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <WorkoutForm
                initialData={workout}
                onSubmit={handleEdit}
                onCancel={() => setEditingId(null)}
                submitLabel="Update Workout"
              />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    workoutTypeColors[workout.type]
                  }`}>
                    {workout.type}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(workout.date)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShareButton 
                    result={createShareableWorkout(workout)}
                    className="text-xs px-2 py-1"
                  />
                  <button
                    onClick={() => setEditingId(workout.id)}
                    className="p-2 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors duration-200"
                    title="Edit workout"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {deletingId === workout.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        title="Confirm delete"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        title="Cancel delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(workout.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">{workout.duration}min</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">{workout.distance}m</span>
                </div>
                {workout.sets && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">#</span>
                    <span className="font-medium text-gray-900 dark:text-white">{workout.sets} sets</span>
                  </div>
                )}
                {workout.restInterval && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">⏱</span>
                    <span className="font-medium text-gray-900 dark:text-white">{workout.restInterval} rest</span>
                  </div>
                )}
              </div>

              {workout.notes && (
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{workout.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}