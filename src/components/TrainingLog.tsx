import React, { useState, useEffect } from 'react';
import { Plus, Activity, Calendar } from 'lucide-react';
import { WorkoutForm } from './WorkoutForm';
import { WorkoutsList } from './WorkoutsList';
import { Workout } from '../types/training';
import { getWorkouts, saveWorkout } from '../utils/storage';

export function TrainingLog() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  const handleAddWorkout = (workoutData: Omit<Workout, 'id'>) => {
    saveWorkout(workoutData);
    setWorkouts(getWorkouts());
    setShowForm(false);
  };

  const handleUpdateWorkouts = () => {
    setWorkouts(getWorkouts());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Training Log</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Record and track your swimming workouts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Workout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-teal-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{workouts.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Workouts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {workouts.filter(w => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(w.date) >= weekAgo;
                }).length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">This Week</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">KM</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(workouts.reduce((total, workout) => total + workout.distance, 0) / 1000).toFixed(1)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Total Distance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Log Workout</h3>
              <WorkoutForm
                onSubmit={handleAddWorkout}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Workouts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Workouts</h3>
          <WorkoutsList workouts={workouts} onUpdate={handleUpdateWorkouts} />
        </div>
      </div>
    </div>
  );
}