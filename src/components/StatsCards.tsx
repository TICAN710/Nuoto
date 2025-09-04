import React from 'react';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { SwimmingTime } from '../types/swimming';
import { Workout } from '../types/training';
import { formatTime } from '../utils/formatters';

interface StatsCardsProps {
  times: SwimmingTime[];
  workouts: Workout[];
}

export function StatsCards({ times, workouts }: StatsCardsProps) {
  // Calculate best improvement (biggest time drop)
  const getBestImprovement = () => {
    const freestyleTimes = times
      .filter(t => t.stroke === 'freestyle' && t.distance === 50)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (freestyleTimes.length < 2) return null;
    
    let bestImprovement = 0;
    for (let i = 1; i < freestyleTimes.length; i++) {
      const improvement = freestyleTimes[i - 1].time - freestyleTimes[i].time;
      if (improvement > bestImprovement) {
        bestImprovement = improvement;
      }
    }
    
    return bestImprovement > 0 ? bestImprovement : null;
  };

  // Calculate current streak
  const getCurrentStreak = () => {
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date();
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const bestImprovement = getBestImprovement();
  const currentStreak = getCurrentStreak();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Personal Bests</p>
            <p className="text-2xl font-bold">{times.length > 0 ? times.length : '0'}</p>
          </div>
          <Award className="w-8 h-8 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">Training Streak</p>
            <p className="text-2xl font-bold">{currentStreak} days</p>
          </div>
          <Calendar className="w-8 h-8 text-teal-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Best Improvement</p>
            <p className="text-2xl font-bold">
              {bestImprovement ? `-${formatTime(bestImprovement)}` : '--'}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-100 text-sm">Total Distance</p>
            <p className="text-2xl font-bold">
              {(workouts.reduce((total, w) => total + w.distance, 0) / 1000).toFixed(1)}km
            </p>
          </div>
          <Target className="w-8 h-8 text-cyan-200" />
        </div>
      </div>
    </div>
  );
}