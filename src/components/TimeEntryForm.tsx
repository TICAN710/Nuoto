import React, { useState, useEffect } from 'react';
import { SwimmingTime, Stroke, Distance } from '../types/swimming';

interface TimeEntryFormProps {
  onSubmit: (timeData: Omit<SwimmingTime, 'id'>) => void;
  onCancel: () => void;
  initialData?: SwimmingTime;
  submitLabel?: string;
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

export function TimeEntryForm({ onSubmit, onCancel, initialData, submitLabel = 'Add Time' }: TimeEntryFormProps) {
  const [stroke, setStroke] = useState<Stroke>('freestyle');
  const [distance, setDistance] = useState<Distance>(50);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [milliseconds, setMilliseconds] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setStroke(initialData.stroke);
      setDistance(initialData.distance);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setNotes(initialData.notes || '');
      
      // Parse time
      const totalSeconds = initialData.time;
      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.floor(totalSeconds % 60);
      const ms = Math.round((totalSeconds % 1) * 100);
      
      setMinutes(mins.toString());
      setSeconds(secs.toString());
      setMilliseconds(ms.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate time input
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

    const totalTime = mins * 60 + secs + ms / 100;
    
    onSubmit({
      stroke,
      distance,
      time: totalTime,
      date: new Date(date),
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {distances.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time (MM:SS.MS)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="MM"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="59"
          />
          <span className="text-gray-500 dark:text-gray-400">:</span>
          <input
            type="number"
            placeholder="SS"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="99"
          />
        </div>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
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
          placeholder="Add notes about this swim..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium"
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