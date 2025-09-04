import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Target, Calendar } from 'lucide-react';
import { getSwimmingTimes, getWorkouts } from '../utils/storage';
import { formatTime, formatDate } from '../utils/formatters';
import { SwimmingTime, Stroke, Distance } from '../types/swimming';
import { QuickActions } from './QuickActions';
import { StatsCards } from './StatsCards';

interface DashboardProps {
  onQuickTime: (stroke: string, distance: number) => void;
  onQuickWorkout: (type: string) => void;
}

export function Dashboard({ onQuickTime, onQuickWorkout }: DashboardProps) {
  const times = getSwimmingTimes();
  const workouts = getWorkouts();

  // Get progress data for 50m freestyle (most common event)
  const freestyleTimes = times
    .filter(t => t.stroke === 'freestyle' && t.distance === 50)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10) // Last 10 entries
    .map(t => ({
      date: formatDate(t.date),
      time: t.time,
      formattedTime: formatTime(t.time)
    }));

  // Workout frequency data for last 4 weeks
  const getWorkoutFrequency = () => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });
      
      weeks.push({
        week: `Week ${4-i}`,
        workouts: weekWorkouts.length,
        distance: weekWorkouts.reduce((total, w) => total + w.distance, 0) / 1000
      });
    }
    return weeks;
  };

  const workoutFrequency = getWorkoutFrequency();

  // Get personal bests summary
  const getPersonalBestsSummary = () => {
    const strokes: Stroke[] = ['freestyle', 'backstroke', 'breaststroke', 'butterfly'];
    const distances: Distance[] = [50, 100, 200];
    
    return strokes.map(stroke => {
      const strokeBests = distances.map(distance => {
        const strokeTimes = times.filter(t => t.stroke === stroke && t.distance === distance);
        if (strokeTimes.length === 0) return null;
        return strokeTimes.reduce((best, current) => current.time < best.time ? current : best);
      }).filter(Boolean);
      
      return {
        stroke: stroke.charAt(0).toUpperCase() + stroke.slice(1),
        bests: strokeBests.length,
        total: distances.length
      };
    });
  };

  const personalBestsSummary = getPersonalBestsSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Your swimming performance overview</p>
      </div>

      {/* Enhanced Stats Cards */}
      <StatsCards times={times} workouts={workouts} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <QuickActions onQuickTime={onQuickTime} onQuickWorkout={onQuickWorkout} />

        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">50m Freestyle Progress</h3>
          {freestyleTimes.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={freestyleTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(value) => formatTime(value)}
                    fontSize={12}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: any) => [formatTime(value), 'Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#0EA5E9" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0EA5E9' }}
                    activeDot={{ r: 6, fill: '#0369A1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Add more 50m freestyle times to see progress</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workout Frequency Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Training Volume</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'distance' ? `${value}km` : value,
                  name === 'distance' ? 'Distance' : 'Workouts'
                ]}
              />
              <Bar dataKey="workouts" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personal Bests Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Bests by Stroke</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalBestsSummary.map((summary) => (
            <div key={summary.stroke} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{summary.stroke}</h4>
              <div className="text-2xl font-bold text-blue-600">
                {summary.bests}/{summary.total}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Events with PB</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}