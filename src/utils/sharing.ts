import { SwimmingTime } from '../types/swimming';
import { Workout } from '../types/training';
import { formatTime, formatDate } from './formatters';

export interface ShareableResult {
  type: 'time' | 'workout' | 'achievement' | 'progress';
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

export function createShareableTime(time: SwimmingTime): ShareableResult {
  return {
    type: 'time',
    title: `New Personal Best! 🏊‍♂️`,
    description: `Just swam ${time.distance}m ${time.stroke} in ${formatTime(time.time)} on ${formatDate(time.date)}! #Swimming #PersonalBest #AquaTrack`,
    imageUrl: generateTimeImage(time)
  };
}

export function createShareableWorkout(workout: Workout): ShareableResult {
  return {
    type: 'workout',
    title: `Training Complete! 💪`,
    description: `Completed a ${workout.type} workout: ${workout.distance}m in ${workout.duration} minutes on ${formatDate(workout.date)}! #Swimming #Training #AquaTrack`,
    imageUrl: generateWorkoutImage(workout)
  };
}

export function createShareableAchievement(goalName: string, time: SwimmingTime): ShareableResult {
  return {
    type: 'achievement',
    title: `Goal Achieved! 🎯`,
    description: `Just achieved my goal of ${goalName} with a time of ${formatTime(time.time)}! Hard work pays off! #Swimming #GoalAchieved #AquaTrack`,
    imageUrl: generateAchievementImage(goalName, time)
  };
}

export function createShareableProgress(stroke: string, distance: number, improvement: number): ShareableResult {
  return {
    type: 'progress',
    title: `Swimming Progress! 📈`,
    description: `Improved my ${distance}m ${stroke} by ${formatTime(improvement)} this month! Consistency is key! #Swimming #Progress #AquaTrack`,
    imageUrl: generateProgressImage(stroke, distance, improvement)
  };
}

function generateTimeImage(time: SwimmingTime): string {
  // Generate a shareable image URL (placeholder - would integrate with image generation service)
  return `https://api.aquatrack.app/share/time?stroke=${time.stroke}&distance=${time.distance}&time=${time.time}`;
}

function generateWorkoutImage(workout: Workout): string {
  return `https://api.aquatrack.app/share/workout?type=${workout.type}&distance=${workout.distance}&duration=${workout.duration}`;
}

function generateAchievementImage(goalName: string, time: SwimmingTime): string {
  return `https://api.aquatrack.app/share/achievement?goal=${encodeURIComponent(goalName)}&time=${time.time}`;
}

function generateProgressImage(stroke: string, distance: number, improvement: number): string {
  return `https://api.aquatrack.app/share/progress?stroke=${stroke}&distance=${distance}&improvement=${improvement}`;
}

export async function shareToSocial(result: ShareableResult, platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'copy'): Promise<boolean> {
  const text = `${result.title}\n\n${result.description}`;
  
  try {
    switch (platform) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank');
        break;
        
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        window.open(facebookUrl, '_blank');
        break;
        
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        break;
        
      case 'copy':
        await navigator.clipboard.writeText(text);
        break;
        
      default:
        return false;
    }
    return true;
  } catch (error) {
    console.error('Sharing failed:', error);
    return false;
  }
}

export function canShare(): boolean {
  return 'share' in navigator || 'clipboard' in navigator;
}

export async function nativeShare(result: ShareableResult): Promise<boolean> {
  if ('share' in navigator) {
    try {
      await navigator.share({
        title: result.title,
        text: result.description,
        url: result.url || window.location.href
      });
      return true;
    } catch (error) {
      console.error('Native sharing failed:', error);
      return false;
    }
  }
  return false;
}