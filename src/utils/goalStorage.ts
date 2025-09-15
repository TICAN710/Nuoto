import { Goal, GoalProgress } from '../types/goals';

const GOALS_KEY = 'aquatrack-goals';

export function getGoals(): Goal[] {
  try {
    const stored = localStorage.getItem(GOALS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((goal: any) => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      achievedAt: goal.achievedAt ? new Date(goal.achievedAt) : undefined
    }));
  } catch (error) {
    console.error('Error loading goals:', error);
    return [];
  }
}

export function saveGoal(goalData: Omit<Goal, 'id'>): Goal {
  const newGoal: Goal = {
    ...goalData,
    id: Date.now().toString(),
  };
  
  const goals = getGoals();
  goals.push(newGoal);
  
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  return newGoal;
}

export function updateGoal(id: string, goalData: Omit<Goal, 'id'>): Goal {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error('Goal not found');
  }
  
  const updatedGoal: Goal = {
    ...goalData,
    id,
  };
  
  goals[index] = updatedGoal;
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  return updatedGoal;
}

export function deleteGoal(id: string): void {
  const goals = getGoals();
  const filteredGoals = goals.filter(g => g.id !== id);
  localStorage.setItem(GOALS_KEY, JSON.stringify(filteredGoals));
}

export function markGoalAchieved(id: string): Goal {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);
  
  if (!goal) {
    throw new Error('Goal not found');
  }
  
  const updatedGoal = {
    ...goal,
    achievedAt: new Date(),
    isActive: false
  };
  
  return updateGoal(id, updatedGoal);
}