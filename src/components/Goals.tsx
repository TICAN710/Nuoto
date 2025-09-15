import React, { useState, useEffect } from 'react';
import { Plus, Target, Trophy, Calendar, TrendingUp, Share2, Trash2, Edit2 } from 'lucide-react';
import { Goal } from '../types/goals';
import { getGoals, saveGoal, deleteGoal, markGoalAchieved } from '../utils/goalStorage';
import { getSwimmingTimes } from '../utils/storage';
import { predictGoalAchievement, generateMotivationalMessage } from '../utils/predictions';
import { createShareableAchievement, shareToSocial } from '../utils/sharing';
import { formatTime, formatDate } from '../utils/formatters';
import { GoalForm } from './GoalForm';

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [times, setTimes] = useState(getSwimmingTimes());

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const handleAddGoal = (goalData: Omit<Goal, 'id'>) => {
    saveGoal(goalData);
    setGoals(getGoals());
    setShowForm(false);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      setGoals(getGoals());
    }
  };

  const handleAchieveGoal = (goal: Goal) => {
    markGoalAchieved(goal.id);
    setGoals(getGoals());
    
    // Find the best time for this goal
    const bestTime = times
      .filter(t => t.stroke === goal.stroke && t.distance === goal.distance)
      .reduce((best, current) => current.time < best.time ? current : best);
    
    if (bestTime) {
      const shareableResult = createShareableAchievement(
        `${goal.distance}m ${goal.stroke} under ${formatTime(goal.targetTime)}`,
        bestTime
      );
      
      // Auto-share achievement (optional)
      shareToSocial(shareableResult, 'copy');
      alert('🎉 Congratulations! Goal achieved and copied to clipboard for sharing!');
    }
  };

  const activeGoals = goals.filter(g => g.isActive);
  const achievedGoals = goals.filter(g => !g.isActive && g.achievedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Swimming Goals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set targets and track your progress with AI predictions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </button>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Goal</h3>
              <GoalForm
                onSubmit={handleAddGoal}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-600" />
          Active Goals ({activeGoals.length})
        </h3>
        
        {activeGoals.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">No active goals</p>
            <p className="text-sm">Set your first swimming goal to start tracking progress!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const prediction = predictGoalAchievement(goal, times);
              const currentBest = times
                .filter(t => t.stroke === goal.stroke && t.distance === goal.distance)
                .reduce((best, current) => current.time < best.time ? current : best, { time: Infinity });
              
              const progress = currentBest.time !== Infinity 
                ? Math.max(0, Math.min(100, ((currentBest.time - goal.targetTime) / currentBest.time) * 100))
                : 0;

              return (
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {goal.distance}m {goal.stroke}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {formatTime(goal.targetTime)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Best */}
                  {currentBest.time !== Infinity && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Best</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatTime(currentBest.time)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Need to improve</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {formatTime(Math.max(0, currentBest.time - goal.targetTime))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Prediction */}
                  {prediction.predictedDate && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Prediction</span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Predicted achievement: {formatDate(prediction.predictedDate)}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Confidence: {prediction.confidence.toFixed(0)}% • Trend: {prediction.currentTrend}
                      </p>
                    </div>
                  )}

                  {/* Motivational Message */}
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {generateMotivationalMessage(prediction, goal)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {currentBest.time !== Infinity && currentBest.time <= goal.targetTime && (
                      <button
                        onClick={() => handleAchieveGoal(goal)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Mark Achieved! 🎉
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achieved Goals */}
      {achievedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Achieved Goals ({achievedGoals.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievedGoals.map((goal) => (
              <div key={goal.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 p-4">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {goal.distance}m {goal.stroke}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Target: {formatTime(goal.targetTime)}
                </p>
                {goal.achievedAt && (
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Achieved on {formatDate(goal.achievedAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}