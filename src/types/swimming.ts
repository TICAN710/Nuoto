export type Stroke = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly';
export type Distance = 25 | 50 | 100 | 200 | 400 | 800 | 1500;

export interface SwimmingTime {
  id: string;
  stroke: Stroke;
  distance: Distance;
  time: number; // time in seconds (decimal for milliseconds)
  date: Date;
  notes?: string;
}