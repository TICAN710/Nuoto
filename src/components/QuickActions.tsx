import React from 'react';
import { Clock, Zap, Target, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onQuickTime: (stroke: string, distance: number) => void;
  onQuickWorkout: (type: string) => void;
}

const quickTimes = [
  { stroke: 'freestyle', distance: 50, label: '50m Free' },
  { stroke: 'freestyle', distance: 100, label: '100m Free' },
  { stroke: 'breaststroke', distance: 50, label: '50m Breast' },
  { stroke: 'butterfly', distance: 50, label: '50m Fly' },
];

const quickWorkouts = [
  { type: 'speed', label: 'Sprint Set', icon: Zap },
  { type: 'endurance', label: 'Distance', icon: Target },
  { type: 'technique', label: 'Technique', icon: TrendingUp },
];

export function QuickActions({ onQuickTime, onQuickWorkout }: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      
      <div className="space-y-4">
        {/* Quick Time Entry */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Time Entry</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickTimes.map((item) => (
              <button
                key={`${item.stroke}-${item.distance}`}
                onClick={() => onQuickTime(item.stroke, item.distance)}
                className="flex items-center justify-center px-3 py-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <Clock className="w-3 h-3 mr-1" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Workout Entry */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Workout</h4>
          <div className="grid grid-cols-1 gap-2">
            {quickWorkouts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onQuickWorkout(item.type)}
                  className="flex items-center justify-center px-3 py-2 text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors duration-200"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}