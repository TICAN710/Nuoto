import { format } from 'date-fns';

export function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.round((timeInSeconds % 1) * 100);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'MMM dd, yyyy');
}

export function formatDateShort(date: Date | string | number): string {
  const dateObj = new Date(date);
  return format(dateObj, 'MM/dd');
}