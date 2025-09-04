import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { getSwimmingTimes, getWorkouts } from '../utils/storage';
import { formatTime, formatDate } from '../utils/formatters';
import { ImportData } from './ImportData';

interface ExportDataProps {
  onDataUpdate?: () => void;
}

export function ExportData({ onDataUpdate }: ExportDataProps) {
  const times = getSwimmingTimes();
  const workouts = getWorkouts();

  const exportTimesToCSV = () => {
    const headers = ['Date', 'Stroke', 'Distance', 'Time', 'Notes'];
    const rows = times.map(time => [
      formatDate(time.date),
      time.stroke,
      `${time.distance}m`,
      formatTime(time.time),
      time.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csvContent, 'swimming-times.csv', 'text/csv');
  };

  const exportWorkoutsToCSV = () => {
    const headers = ['Date', 'Type', 'Duration (min)', 'Distance (m)', 'Sets', 'Rest Interval', 'Notes'];
    const rows = workouts.map(workout => [
      formatDate(workout.date),
      workout.type,
      workout.duration.toString(),
      workout.distance.toString(),
      workout.sets?.toString() || '',
      workout.restInterval || '',
      workout.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csvContent, 'training-log.csv', 'text/csv');
  };

  const exportAllToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      swimmingTimes: times,
      workouts: workouts
    };

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'aquatrack-data.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Export Data</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Download your swimming data for analysis or backup</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Swimming Times Export */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Swimming Times</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{times.length} recorded times</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Export all your recorded swimming times with stroke, distance, and performance data.
          </p>
          <button
            onClick={exportTimesToCSV}
            disabled={times.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as CSV
          </button>
        </div>

        {/* Training Log Export */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Log</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{workouts.length} logged workouts</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Export your complete training log with workout details and notes.
          </p>
          <button
            onClick={exportWorkoutsToCSV}
            disabled={workouts.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as CSV
          </button>
        </div>

        {/* Complete Data Export */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Download className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Backup</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">All data included</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Export all your data in JSON format for backup or migration purposes.
          </p>
          <button
            onClick={exportAllToJSON}
            disabled={times.length === 0 && workouts.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as JSON
          </button>
        </div>
      </div>

      {/* Import Section */}
      <ImportData onImportComplete={() => onDataUpdate?.()} />

      {/* Data Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last recorded time:</span>
                <span className="font-medium">
                  {times.length > 0 
                    ? formatDate(Math.max(...times.map(t => new Date(t.date).getTime())))
                    : 'None'
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last workout:</span>
                <span className="font-medium">
                  {workouts.length > 0
                    ? formatDate(Math.max(...workouts.map(w => new Date(w.date).getTime())))
                    : 'None'
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Data Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Swimming times:</span>
                <span className="font-medium">{times.length} entries</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Training sessions:</span>
                <span className="font-medium">{workouts.length} entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}