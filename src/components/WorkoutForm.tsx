import React, { useState, useEffect } from 'react';
import { Workout, WorkoutType } from '../types/training';

interface WorkoutFormProps {
  onSubmit: (workoutData: Omit<Workout, 'id'>) => void;
  onCancel: () => void;
  initialData?: Workout;
  submitLabel?: string;
}

const workoutTypes: { value: WorkoutType; label: string; description: string }[] = [
  { value: 'technique', label: 'Technique', description: 'Focus on stroke mechanics and form' },
  { value: 'endurance', label: 'Endurance', description: 'Long distance and aerobic conditioning' },
  { value: 'speed', label: 'Speed', description: 'Sprint work and anaerobic training' },
  { value: 'recovery', label: 'Recovery', description: 'Easy swimming for active recovery' },
  { value: 'mixed', label: 'Mixed', description: 'Combination of different training elements' },
];

export function WorkoutForm({ onSubmit, onCancel, initialData, submitLabel = 'Log Workout' }: WorkoutFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('mixed');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [sets, setSets] = useState('');
  const [restInterval, setRestInterval] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setWorkoutType(initialData.type);
      setDuration(initialData.duration.toString());
      setDistance(initialData.distance.toString());
      setSets(initialData.sets?.toString() || '');
      setRestInterval(initialData.restInterval || '');
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      date: new Date(date),
      type: workoutType,
      duration: parseInt(duration),
      distance: parseInt(distance),
      sets: parseInt(sets) || undefined,
      restInterval: restInterval.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* Workout Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Workout Type
        </label>
        <select
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {workoutTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Duration and Distance */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Distance (meters)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="1000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            min="25"
            step="25"
            required
          />
        </div>
      </div>

      {/* Sets and Rest */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sets (optional)
          </label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="8"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rest Interval (optional)
          </label>
          <input
            type="text"
            value={restInterval}
            onChange={(e) => setRestInterval(e.target.value)}
            placeholder="30s"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did the workout feel? Any observations..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-teal-600 dark:bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-200 font-medium"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}