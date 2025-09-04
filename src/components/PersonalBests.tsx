import React from 'react';
import { Trophy, Target } from 'lucide-react';
import { SwimmingTime, Stroke, Distance } from '../types/swimming';
import { formatTime } from '../utils/formatters';

interface PersonalBestsProps {
  times: SwimmingTime[];
}

const strokes: Stroke[] = ['freestyle', 'backstroke', 'breaststroke', 'butterfly'];
const distances: Distance[] = [25, 50, 100, 200, 400, 800, 1500];

export function PersonalBests({ times }: PersonalBestsProps) {
  const getPersonalBest = (stroke: Stroke, distance: Distance): SwimmingTime | null => {
    const strokeTimes = times.filter(t => t.stroke === stroke && t.distance === distance);
    if (strokeTimes.length === 0) return null;
    return strokeTimes.reduce((best, current) => 
      current.time < best.time ? current : best
    );
  };

  const getTotalPBs = () => {
    let count = 0;
    strokes.forEach(stroke => {
      distances.forEach(distance => {
        if (getPersonalBest(stroke, distance)) count++;
      });
    });
    return count;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Card */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Trophy className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">Personal Bests</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{getTotalPBs()}</div>
            <div className="text-blue-100">Recorded times</div>
          </div>
        </div>
      </div>

      {/* Personal Bests Grid */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Best Times by Event
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strokes.map((stroke) => (
              <div key={stroke} className="space-y-3">
                <h5 className="font-medium text-gray-900 dark:text-white capitalize border-b border-gray-200 dark:border-gray-600 pb-2">
                  {stroke.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h5>
                <div className="space-y-2">
                  {distances.map((distance) => {
                    const pb = getPersonalBest(stroke, distance);
                    return (
                      <div key={distance} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{distance}m</span>
                        <span className={`text-sm font-medium ${
                          pb ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {pb ? formatTime(pb.time) : '--:--'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}