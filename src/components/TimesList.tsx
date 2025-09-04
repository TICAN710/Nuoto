import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, Check, X } from 'lucide-react';
import { SwimmingTime } from '../types/swimming';
import { formatTime, formatDate } from '../utils/formatters';
import { TimeEntryForm } from './TimeEntryForm';
import { updateSwimmingTime, deleteSwimmingTime } from '../utils/storage';

interface TimesListProps {
  times: SwimmingTime[];
  onUpdate: () => void;
}

export function TimesList({ times, onUpdate }: TimesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const sortedTimes = [...times].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (timeData: Omit<SwimmingTime, 'id'>) => {
    if (editingId) {
      updateSwimmingTime(editingId, timeData);
      setEditingId(null);
      onUpdate();
    }
  };

  const handleDelete = (id: string) => {
    deleteSwimmingTime(id);
    setDeletingId(null);
    onUpdate();
  };

  if (times.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">No times recorded yet</p>
        <p className="text-sm">Add your first swimming time to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTimes.map((time) => (
        <div key={time.id}>
          {editingId === time.id ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Edit Swimming Time</h4>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <TimeEntryForm
                initialData={time}
                onSubmit={handleEdit}
                onCancel={() => setEditingId(null)}
                submitLabel="Update Time"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {time.distance}m {time.stroke.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(time.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(time.time)}
                    </div>
                  </div>
                </div>
                {time.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{time.notes}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingId(time.id)}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  title="Edit time"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {deletingId === time.id ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDelete(time.id)}
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
                    onClick={() => setDeletingId(time.id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Delete time"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}