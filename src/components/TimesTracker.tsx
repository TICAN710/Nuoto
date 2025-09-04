import React, { useState, useEffect } from 'react';
import { Plus, Trophy, TrendingUp } from 'lucide-react';
import { TimeEntryForm } from './TimeEntryForm';
import { TimesList } from './TimesList';
import { PersonalBests } from './PersonalBests';
import { SwimmingTime, Stroke } from '../types/swimming';
import { getSwimmingTimes, saveSwimmingTime } from '../utils/storage';

export function TimesTracker() {
  const [times, setTimes] = useState<SwimmingTime[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimes(getSwimmingTimes());
  }, []);

  const handleAddTime = (timeData: Omit<SwimmingTime, 'id'>) => {
    const newTime = saveSwimmingTime(timeData);
    setTimes(getSwimmingTimes());
    setShowForm(false);
  };

  const handleUpdateTimes = () => {
    setTimes(getSwimmingTimes());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Swimming Times</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your personal times and monitor progress</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Time
        </button>
      </div>

      {/* Personal Bests Summary */}
      <PersonalBests times={times} />

      {/* Time Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Swimming Time</h3>
              <TimeEntryForm
                onSubmit={handleAddTime}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Times List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Recent Times
          </h3>
          <TimesList times={times} onUpdate={handleUpdateTimes} />
        </div>
      </div>
    </div>
  );
}