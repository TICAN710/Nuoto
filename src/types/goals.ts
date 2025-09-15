export interface Goal {
  id: string;
  stroke: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly';
  distance: 25 | 50 | 100 | 200 | 400 | 800 | 1500;
  targetTime: number; // in seconds
  currentBest?: number; // in seconds
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  achievedAt?: Date;
  notes?: string;
}

export interface GoalProgress {
  goalId: string;
  progress: number; // percentage 0-100
  timeRemaining: number; // days until deadline
  predictedAchievement?: Date;
  improvementRate: number; // seconds per day
}