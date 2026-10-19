/**
 * Core mathematical, biomechanical and sports science formulas
 */

// Epley Formula: Estimated 1RM = Weight * (1 + Reps / 30)
// Validated for 1 to 15 reps. For reps > 15, returns 0 to prevent high-rep endurance skew.
export function calculateEpley1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  if (reps > 15) return 0;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

// Calculate BMI = kg / (m^2)
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): { label: string; color: string; description: string } {
  if (bmi <= 0) return { label: 'N/A', color: 'text-forge-muted', description: 'Enter valid height & weight' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-400', description: 'Screening index < 18.5' };
  if (bmi < 24.9) return { label: 'Normal Weight', color: 'text-forge-success', description: 'Screening index 18.5–24.9' };
  if (bmi < 29.9) return { label: 'Overweight', color: 'text-amber-400', description: 'Screening index 25.0–29.9' };
  return { label: 'Obese Class', color: 'text-forge-danger', description: 'Screening index ≥ 30.0' };
}

// Running Pace in seconds per km -> formatted string "M:SS /km"
export function formatPace(paceSecondsPerKm: number): string {
  if (!paceSecondsPerKm || paceSecondsPerKm === Infinity || isNaN(paceSecondsPerKm) || paceSecondsPerKm <= 0) {
    return '--:--';
  }
  const mins = Math.floor(paceSecondsPerKm / 60);
  const secs = Math.round(paceSecondsPerKm % 60);
  if (secs === 60) {
    return `${mins + 1}:00`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate speed in km/h from distance in km and duration in seconds
export function calculateSpeedKmh(distanceKm: number, durationSeconds: number): number {
  if (distanceKm <= 0 || durationSeconds <= 0) return 0;
  const hours = durationSeconds / 3600;
  return Math.round((distanceKm / hours) * 100) / 100;
}

// Format duration from seconds into HH:MM:SS or MM:SS
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0 || isNaN(totalSeconds)) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Calculate total working set volume: sum of (weight × reps) across completed working sets
export function calculateWorkingVolume(sets: Array<{ type: string; weight: number; reps: number; completed: boolean }>): number {
  return sets
    .filter(s => s.completed && s.type === 'working')
    .reduce((acc, s) => acc + (s.weight * s.reps), 0);
}

// Unit conversion helpers
export const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 10) / 10;
export const lbsToKg = (lbs: number) => Math.round((lbs / 2.20462) * 10) / 10;
export const kmToMiles = (km: number) => Math.round(km * 0.621371 * 100) / 100;
export const milesToKm = (mi: number) => Math.round((mi / 0.621371) * 100) / 100;
