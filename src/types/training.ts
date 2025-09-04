export type WorkoutType = 'technique' | 'endurance' | 'speed' | 'recovery' | 'mixed';

export interface Workout {
  id: string;
  date: Date;
  type: WorkoutType;
  duration: number; // in minutes
  distance: number; // in meters
  sets?: number;
  restInterval?: string;
  notes?: string;
}