export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'mi';

export type MuscleGroup = 
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps'
  | 'Legs' | 'Glutes' | 'Core' | 'Calves' | 'Full body'
  | 'Olympic lifts' | 'Calisthenics' | 'Plyometrics' | 'Mobility';

export type EquipmentType = 
  | 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' 
  | 'Bodyweight' | 'Kettlebell' | 'Bands' | 'Cardio Equipment';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipment: EquipmentType;
  isCustom?: boolean;
  notes?: string;
}

export type SetType = 'warmup' | 'working' | 'dropset';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  reps: number;
  weight: number; // Stored in kg internally
  isBodyweight?: boolean;
  addedWeight?: number;
  assistedWeight?: number;
  side?: 'left' | 'right' | 'bilateral';
  rpe?: number; // 6 to 10
  completed: boolean;
  restTimeSeconds?: number;
}

export interface ExerciseSession {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  startTime: string; // ISO String
  endTime?: string;
  durationSeconds: number;
  sessions: ExerciseSession[];
  totalVolumeKg: number;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId?: string;
  exerciseName: string;
  type: 'heaviest_weight' | 'max_reps' | 'estimated_1rm' | 'best_volume' | 'fastest_run' | 'longest_run';
  value: number; // kg, reps, seconds, or meters
  formattedValue: string;
  previousValue?: number;
  date: string;
  workoutId?: string;
  formulaNote?: string;
}

export interface BodyMetricEntry {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  hipCm?: number;
  neckCm?: number;
  bodyFatPercentage?: number;
  leanBodyMassKg?: number;
  notes?: string;
}

export type RunType = 'easy' | 'tempo' | 'interval' | 'long' | 'recovery' | 'race' | 'treadmill';

export interface RunLog {
  id: string;
  userId: string;
  date: string;
  distanceKm: number;
  durationSeconds: number;
  avgPaceSecondsPerKm: number; // e.g. 300s = 5:00 min/km
  avgSpeedKmh: number;
  runType: RunType;
  isGpsTracked: boolean;
  elevationGainMeters?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  cadence?: number;
  caloriesBurned?: number;
  perceivedEffort?: number; // 1-10
  routeNotes?: string;
}

export interface AthleticTest {
  id: string;
  userId: string;
  testName: string; // "100m Sprint", "Vertical Jump", "Pull-up Max", etc.
  category: 'Speed' | 'Power' | 'Endurance' | 'Strength' | 'Mobility';
  unit: string; // "s", "cm", "reps", "min"
  value: number;
  date: string;
  notes?: string;
}

export interface WellnessCheckIn {
  id: string;
  userId: string;
  date: string;
  sleepDurationHours: number;
  sleepQuality: number; // 1-5
  energyLevel: number; // 1-5
  sorenessLevel: number; // 1-5
  stressLevel: number; // 1-5
  motivationLevel: number; // 1-5
  restingHeartRate?: number;
  notes?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: 'weight' | 'strength' | 'distance' | 'frequency' | 'performance';
  startValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  startDate: string;
  targetDate?: string;
  status: 'active' | 'completed' | 'abandoned';
}

export interface PlannedSession {
  id: string;
  userId: string;
  date: string;
  title: string;
  type: 'workout' | 'run' | 'mobility' | 'rest';
  details?: string;
  completed: boolean;
  linkedActivityId?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  heightCm: number;
  weightGoalKg?: number;
  targetWeightRange?: [number, number];
  preferredWeightUnit: WeightUnit;
  preferredDistanceUnit: DistanceUnit;
  weeklyWorkoutTarget: number;
  weeklyRunningDistanceTargetKm: number;
  dashboardCards: string[];
}
