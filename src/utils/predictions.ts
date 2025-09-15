import { SwimmingTime } from '../types/swimming';
import { Goal } from '../types/goals';

export interface PredictionResult {
  goalId: string;
  predictedDate: Date | null;
  confidence: number; // 0-100
  daysToGoal: number | null;
  requiredImprovement: number; // seconds
  currentTrend: 'improving' | 'stable' | 'declining';
  improvementRate: number; // seconds per day
}

export function predictGoalAchievement(
  goal: Goal,
  recentTimes: SwimmingTime[]
): PredictionResult {
  // Filter times for the specific stroke and distance
  const relevantTimes = recentTimes
    .filter(t => t.stroke === goal.stroke && t.distance === goal.distance)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Last 10 times for trend analysis

  if (relevantTimes.length < 3) {
    return {
      goalId: goal.id,
      predictedDate: null,
      confidence: 0,
      daysToGoal: null,
      requiredImprovement: goal.currentBest ? goal.currentBest - goal.targetTime : 0,
      currentTrend: 'stable',
      improvementRate: 0
    };
  }

  // Calculate improvement rate using linear regression
  const timePoints = relevantTimes.map((time, index) => ({
    x: index,
    y: time.time,
    date: new Date(time.date)
  }));

  const n = timePoints.length;
  const sumX = timePoints.reduce((sum, point) => sum + point.x, 0);
  const sumY = timePoints.reduce((sum, point) => sum + point.y, 0);
  const sumXY = timePoints.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = timePoints.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Convert slope to improvement per day
  const avgDaysBetweenTimes = timePoints.length > 1 
    ? (timePoints[timePoints.length - 1].date.getTime() - timePoints[0].date.getTime()) / (1000 * 60 * 60 * 24) / (timePoints.length - 1)
    : 30;
  
  const improvementRate = -slope / avgDaysBetweenTimes; // negative because we want improvement (lower times)

  // Determine trend
  const currentTrend: 'improving' | 'stable' | 'declining' = 
    improvementRate > 0.01 ? 'improving' : 
    improvementRate < -0.01 ? 'declining' : 'stable';

  // Calculate current best and required improvement
  const currentBest = Math.min(...relevantTimes.map(t => t.time));
  const requiredImprovement = currentBest - goal.targetTime;

  // Predict achievement date
  let predictedDate: Date | null = null;
  let daysToGoal: number | null = null;
  let confidence = 0;

  if (improvementRate > 0 && requiredImprovement > 0) {
    daysToGoal = Math.ceil(requiredImprovement / improvementRate);
    predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + daysToGoal);

    // Calculate confidence based on consistency of improvement
    const predictions = timePoints.map((_, i) => intercept + slope * i);
    const actualTimes = timePoints.map(p => p.y);
    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - actualTimes[i], 2), 0) / n;
    const variance = actualTimes.reduce((sum, time) => sum + Math.pow(time - sumY / n, 2), 0) / n;
    
    confidence = Math.max(0, Math.min(100, (1 - mse / variance) * 100));
  }

  return {
    goalId: goal.id,
    predictedDate,
    confidence,
    daysToGoal,
    requiredImprovement,
    currentTrend,
    improvementRate
  };
}

export function generateMotivationalMessage(prediction: PredictionResult, goal: Goal): string {
  const messages = {
    improving: [
      `Great progress! You're on track to achieve your goal in ${prediction.daysToGoal} days! 🏊‍♂️`,
      `Excellent improvement rate! Keep up the consistent training! 💪`,
      `You're swimming faster every session. Goal achievement is within reach! 🎯`
    ],
    stable: [
      `Your times are consistent. Try mixing up your training to break through! 🔄`,
      `Steady performance! Consider adding some speed work to reach your goal faster. ⚡`,
      `Consistency is key! A few focused sessions could unlock your next breakthrough. 🔓`
    ],
    declining: [
      `Don't worry about recent times. Every swimmer has ups and downs! 📈`,
      `Consider reviewing your training plan or taking a recovery week. 🛌`,
      `Focus on technique work to get back on track to your goal! 🎯`
    ]
  };

  const categoryMessages = messages[prediction.currentTrend];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}