import React, { useState } from 'react';
import { Goal, Stroke, Distance } from '../types/goals';

interface GoalFormProps {
  onSubmit: (goalData: Omit<Goal, 'id'>) => void;
  onCancel: () => void;
  initialData?: Goal;
}

const strokes: { value: Stroke; label: string }[] = [
  { value: 'freestyle', label: 'Freestyle' },
  { value: 'backstroke', label: 'Backstroke' },
  { value: 'breaststroke', label: 'Breaststroke' },
  { value: 'butterfly', label: 'Butterfly' },
];

const distances: { value: Distance; label: string }[] = [
  { value: 25, label: '25m' },
  { value: 50, label: '50m' },
  { value: 100, label: '100m' },
  { value: 200, label: '200m' },
  { value: 400, label: '400m' },
  { value: 800, label: '800m' },
  { value: 1500, label: '1500m' },
];

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [stroke, setStroke] = useState<Stroke>(initialData?.stroke || 'freestyle');
  const [distance, setDistance] = useState<Distance>(initialData?.distance || 50);
  const [minutes, setMinutes] = useState(initialData ? Math.floor(initialData.targetTime / 60).toString() : '');
  const [seconds, setSeconds] = useState(initialData ? Math.floor(initialData.targetTime % 60).toString() : '');
  const [milliseconds, setMilliseconds] = useState(initialData ? Math.round((initialData.targetTime % 1) * 100).toString() : '');
  const [deadline, setDeadline] = useState(initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const ms = parseInt(milliseconds) || 0;
    
    if (secs >= 60) {
      alert('Seconds must be less than 60');
      return;
    }
    
    if (ms >= 100) {
      alert('Milliseconds must be less than 100');
      return;
    }

    const targetTime = mins * 60 + secs + ms / 100;
    
    onSubmit({
      stroke,
      distance,
      targetTime,
      deadline: deadline ? new Date(deadline) : undefined,
      isActive: true,
      createdAt: new Date(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stroke Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stroke
        </label>
        <select
          value={stroke}
          onChange={(e) => setStroke(e.target.value as Stroke)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {strokes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Distance Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Distance
        </label>
        <select
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value) as Distance)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {distances.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Target Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Time (MM:SS.MS)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="MM"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="59"
          />
          <span className="text-gray-500 dark:text-gray-400">:</span>
          <input
            type="number"
            placeholder="SS"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="59"
            required
          />
          <span className="text-gray-500 dark:text-gray-400">.</span>
          <input
            type="number"
            placeholder="MS"
            value={milliseconds}
            onChange={(e) => setMilliseconds(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="99"
          />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Deadline (optional)
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why is this goal important to you?"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 font-medium"
        >
          Create Goal
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