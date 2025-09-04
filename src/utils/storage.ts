import { SwimmingTime } from '../types/swimming';
import { Workout } from '../types/training';

const SWIMMING_TIMES_KEY = 'aquatrack-swimming-times';
const WORKOUTS_KEY = 'aquatrack-workouts';

// Swimming Times Storage
export function getSwimmingTimes(): SwimmingTime[] {
  try {
    const stored = localStorage.getItem(SWIMMING_TIMES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((time: any) => ({
      ...time,
      date: new Date(time.date)
    }));
  } catch (error) {
    console.error('Error loading swimming times:', error);
    return [];
  }
}

export function saveSwimmingTime(timeData: Omit<SwimmingTime, 'id'>): SwimmingTime {
  const newTime: SwimmingTime = {
    ...timeData,
    id: Date.now().toString(),
  };
  
  const times = getSwimmingTimes();
  times.push(newTime);
  
  localStorage.setItem(SWIMMING_TIMES_KEY, JSON.stringify(times));
  return newTime;
}

export function updateSwimmingTime(id: string, timeData: Omit<SwimmingTime, 'id'>): SwimmingTime {
  const times = getSwimmingTimes();
  const index = times.findIndex(t => t.id === id);
  
  if (index === -1) {
    throw new Error('Swimming time not found');
  }
  
  const updatedTime: SwimmingTime = {
    ...timeData,
    id,
  };
  
  times[index] = updatedTime;
  localStorage.setItem(SWIMMING_TIMES_KEY, JSON.stringify(times));
  return updatedTime;
}

export function deleteSwimmingTime(id: string): void {
  const times = getSwimmingTimes();
  const filteredTimes = times.filter(t => t.id !== id);
  localStorage.setItem(SWIMMING_TIMES_KEY, JSON.stringify(filteredTimes));
}

// Workouts Storage
export function getWorkouts(): Workout[] {
  try {
    const stored = localStorage.getItem(WORKOUTS_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((workout: any) => ({
      ...workout,
      date: new Date(workout.date)
    }));
  } catch (error) {
    console.error('Error loading workouts:', error);
    return [];
  }
}

export function saveWorkout(workoutData: Omit<Workout, 'id'>): Workout {
  const newWorkout: Workout = {
    ...workoutData,
    id: Date.now().toString(),
  };
  
  const workouts = getWorkouts();
  workouts.push(newWorkout);
  
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  return newWorkout;
}

export function updateWorkout(id: string, workoutData: Omit<Workout, 'id'>): Workout {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  
  if (index === -1) {
    throw new Error('Workout not found');
  }
  
  const updatedWorkout: Workout = {
    ...workoutData,
    id,
  };
  
  workouts[index] = updatedWorkout;
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  return updatedWorkout;
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts();
  const filteredWorkouts = workouts.filter(w => w.id !== id);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
}

// Clear all data (for testing purposes)
export function clearAllData(): void {
  localStorage.removeItem(SWIMMING_TIMES_KEY);
  localStorage.removeItem(WORKOUTS_KEY);
}