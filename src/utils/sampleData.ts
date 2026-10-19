import { 
  UserProfile, Exercise, Workout, BodyMetricEntry, 
  RunLog, AthleticTest, WellnessCheckIn, PersonalRecord, 
  Goal, PlannedSession 
} from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  { id: 'ex_1', name: 'Barbell Bench Press', category: 'Chest', equipment: 'Barbell' },
  { id: 'ex_2', name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbell' },
  { id: 'ex_3', name: 'Dips (Weighted/Bodyweight)', category: 'Chest', equipment: 'Bodyweight' },
  { id: 'ex_4', name: 'Barbell Back Squat', category: 'Legs', equipment: 'Barbell' },
  { id: 'ex_5', name: 'Front Squat', category: 'Legs', equipment: 'Barbell' },
  { id: 'ex_6', name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell' },
  { id: 'ex_7', name: 'Bulgarian Split Squat', category: 'Legs', equipment: 'Dumbbell' },
  { id: 'ex_8', name: 'Conventional Deadlift', category: 'Back', equipment: 'Barbell' },
  { id: 'ex_9', name: 'Weighted Pull-Up', category: 'Back', equipment: 'Bodyweight' },
  { id: 'ex_10', name: 'Barbell Pendlay Row', category: 'Back', equipment: 'Barbell' },
  { id: 'ex_11', name: 'Overhead Shoulder Press', category: 'Shoulders', equipment: 'Barbell' },
  { id: 'ex_12', name: 'Dumbbell Lateral Raise', category: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'ex_13', name: 'Incline Dumbbell Curl', category: 'Biceps', equipment: 'Dumbbell' },
  { id: 'ex_14', name: 'Triceps Overhead Extension', category: 'Cable', equipment: 'Cable' },
  { id: 'ex_15', name: 'Hanging Leg Raise', category: 'Core', equipment: 'Bodyweight' },
  { id: 'ex_16', name: 'Standing Calf Raise', category: 'Calves', equipment: 'Machine' },
  { id: 'ex_17', name: 'Power Clean', category: 'Olympic lifts', equipment: 'Barbell' },
  { id: 'ex_18', name: 'Snatch', category: 'Olympic lifts', equipment: 'Barbell' },
  { id: 'ex_19', name: 'Box Jump (30")', category: 'Plyometrics', equipment: 'Bodyweight' },
  { id: 'ex_20', name: 'Thoracic Extension & Foam Roll', category: 'Mobility', equipment: 'Bodyweight' },
];

export const INITIAL_PROFILE: UserProfile = {
  id: 'user_master',
  displayName: 'Marcus Vance',
  email: 'marcus.vance@forge.athletic',
  heightCm: 182,
  weightGoalKg: 82.0,
  targetWeightRange: [81.0, 83.5],
  preferredWeightUnit: 'kg',
  preferredDistanceUnit: 'km',
  weeklyWorkoutTarget: 5,
  weeklyRunningDistanceTargetKm: 25.0,
  dashboardCards: ['weight', 'bmi', 'weekly_workouts', 'running_mileage', 'streak', 'prs', 'wellness']
};

export function generateSampleAthleticDataset() {
  const today = new Date();
  const d = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  const workouts: Workout[] = [
    {
      id: 'w_1',
      userId: 'user_master',
      name: 'Push Hypertrophy & Bench Power',
      startTime: `${d(1)}T07:30:00Z`,
      endTime: `${d(1)}T08:45:00Z`,
      durationSeconds: 4500,
      totalVolumeKg: 7850,
      notes: 'Clean bar path on heavy bench sets. Kept rest interval under 90s.',
      sessions: [
        {
          exerciseId: 'ex_1',
          exerciseName: 'Barbell Bench Press',
          category: 'Chest',
          sets: [
            { id: 's1', setNumber: 1, type: 'warmup', weight: 60, reps: 10, completed: true },
            { id: 's2', setNumber: 2, type: 'working', weight: 100, reps: 5, rpe: 8, completed: true },
            { id: 's3', setNumber: 3, type: 'working', weight: 105, reps: 5, rpe: 8.5, completed: true },
            { id: 's4', setNumber: 4, type: 'working', weight: 110, reps: 4, rpe: 9.5, completed: true }
          ]
        },
        {
          exerciseId: 'ex_11',
          exerciseName: 'Overhead Shoulder Press',
          category: 'Shoulders',
          sets: [
            { id: 's5', setNumber: 1, type: 'working', weight: 60, reps: 6, rpe: 8, completed: true },
            { id: 's6', setNumber: 2, type: 'working', weight: 60, reps: 6, rpe: 8.5, completed: true },
            { id: 's7', setNumber: 3, type: 'working', weight: 65, reps: 5, rpe: 9, completed: true }
          ]
        }
      ]
    },
    {
      id: 'w_2',
      userId: 'user_master',
      name: 'Heavy Lower Body & Squats',
      startTime: `${d(3)}T16:00:00Z`,
      endTime: `${d(3)}T17:15:00Z`,
      durationSeconds: 4500,
      totalVolumeKg: 10240,
      notes: 'Deep squat depth below parallel. Bracing stayed tight.',
      sessions: [
        {
          exerciseId: 'ex_4',
          exerciseName: 'Barbell Back Squat',
          category: 'Legs',
          sets: [
            { id: 's8', setNumber: 1, type: 'warmup', weight: 70, reps: 8, completed: true },
            { id: 's9', setNumber: 2, type: 'working', weight: 140, reps: 5, rpe: 8, completed: true },
            { id: 's10', setNumber: 3, type: 'working', weight: 145, reps: 5, rpe: 8.5, completed: true },
            { id: 's11', setNumber: 4, type: 'working', weight: 150, reps: 3, rpe: 9, completed: true }
          ]
        }
      ]
    },
    {
      id: 'w_3',
      userId: 'user_master',
      name: 'Pull & Grip Conditioning',
      startTime: `${d(5)}T17:00:00Z`,
      endTime: `${d(5)}T18:10:00Z`,
      durationSeconds: 4200,
      totalVolumeKg: 8900,
      sessions: [
        {
          exerciseId: 'ex_8',
          exerciseName: 'Conventional Deadlift',
          category: 'Back',
          sets: [
            { id: 's12', setNumber: 1, type: 'working', weight: 180, reps: 4, rpe: 8, completed: true },
            { id: 's13', setNumber: 2, type: 'working', weight: 190, reps: 3, rpe: 9, completed: true }
          ]
        }
      ]
    }
  ];

  const runs: RunLog[] = [
    {
      id: 'r_1',
      userId: 'user_master',
      date: d(2),
      distanceKm: 5.0,
      durationSeconds: 1500, // 25:00 -> exactly 5:00 min/km and 12.00 km/h
      avgPaceSecondsPerKm: 300,
      avgSpeedKmh: 12.0,
      runType: 'tempo',
      isGpsTracked: true,
      elevationGainMeters: 45,
      avgHeartRate: 158,
      maxHeartRate: 172,
      cadence: 176,
      caloriesBurned: 390,
      perceivedEffort: 7,
      routeNotes: 'Lake loop tempo run with sustained 5:00/km pacing'
    },
    {
      id: 'r_2',
      userId: 'user_master',
      date: d(4),
      distanceKm: 10.2,
      durationSeconds: 3264, // 53:20 -> ~5:14 min/km
      avgPaceSecondsPerKm: 320,
      avgSpeedKmh: 11.25,
      runType: 'long',
      isGpsTracked: true,
      elevationGainMeters: 110,
      avgHeartRate: 148,
      maxHeartRate: 165,
      cadence: 172,
      caloriesBurned: 780,
      perceivedEffort: 6,
      routeNotes: 'Aerobic base run with negative splits across the final 3km'
    },
    {
      id: 'r_3',
      userId: 'user_master',
      date: d(6),
      distanceKm: 4.0,
      durationSeconds: 1120, // 4:40 min/km
      avgPaceSecondsPerKm: 280,
      avgSpeedKmh: 12.86,
      runType: 'interval',
      isGpsTracked: false,
      elevationGainMeters: 0,
      avgHeartRate: 168,
      caloriesBurned: 340,
      perceivedEffort: 8,
      routeNotes: 'Interval track sets: 4x800m repeats'
    }
  ];

  const metrics: BodyMetricEntry[] = [
    { id: 'm_4', userId: 'user_master', date: d(0), weightKg: 83.2, heightCm: 182, bmi: 25.1, waistCm: 83.5, chestCm: 109.5, bodyFatPercentage: 13.8 },
    { id: 'm_3', userId: 'user_master', date: d(10), weightKg: 83.9, heightCm: 182, bmi: 25.3, waistCm: 84, chestCm: 109 },
    { id: 'm_2', userId: 'user_master', date: d(20), weightKg: 84.8, heightCm: 182, bmi: 25.6, waistCm: 85, chestCm: 108 },
    { id: 'm_1', userId: 'user_master', date: d(30), weightKg: 85.5, heightCm: 182, bmi: 25.8, waistCm: 86, chestCm: 108 }
  ];

  const prs: PersonalRecord[] = [
    {
      id: 'pr_1',
      userId: 'user_master',
      exerciseName: 'Barbell Bench Press',
      type: 'heaviest_weight',
      value: 110,
      formattedValue: '110.0 kg (4 reps)',
      previousValue: 105,
      date: d(1)
    },
    {
      id: 'pr_2',
      userId: 'user_master',
      exerciseName: 'Barbell Bench Press',
      type: 'estimated_1rm',
      value: 124.7,
      formattedValue: '124.7 kg',
      previousValue: 119.0,
      date: d(1),
      formulaNote: 'Epley Formula: 110 × (1 + 4/30)'
    },
    {
      id: 'pr_3',
      userId: 'user_master',
      exerciseName: '5K Road Run',
      type: 'fastest_run',
      value: 1500, // 25:00
      formattedValue: '25:00 (5:00 /km)',
      previousValue: 1560,
      date: d(2)
    },
    {
      id: 'pr_4',
      userId: 'user_master',
      exerciseName: 'Barbell Back Squat',
      type: 'heaviest_weight',
      value: 150,
      formattedValue: '150.0 kg (3 reps)',
      previousValue: 142.5,
      date: d(3)
    }
  ];

  const wellness: WellnessCheckIn[] = [
    { id: 'wel_1', userId: 'user_master', date: d(0), sleepDurationHours: 7.8, sleepQuality: 4, energyLevel: 4, sorenessLevel: 2, stressLevel: 2, motivationLevel: 5, restingHeartRate: 52 },
    { id: 'wel_2', userId: 'user_master', date: d(1), sleepDurationHours: 8.1, sleepQuality: 5, energyLevel: 4, sorenessLevel: 3, stressLevel: 2, motivationLevel: 4, restingHeartRate: 51 },
    { id: 'wel_3', userId: 'user_master', date: d(2), sleepDurationHours: 6.9, sleepQuality: 3, energyLevel: 3, sorenessLevel: 4, stressLevel: 3, motivationLevel: 4, restingHeartRate: 54 },
    { id: 'wel_4', userId: 'user_master', date: d(3), sleepDurationHours: 7.5, sleepQuality: 4, energyLevel: 5, sorenessLevel: 2, stressLevel: 2, motivationLevel: 5, restingHeartRate: 50 },
  ];

  const tests: AthleticTest[] = [
    { id: 't_1', userId: 'user_master', testName: 'Push-Up Max', category: 'Strength', unit: 'reps', value: 58, date: d(7) },
    { id: 't_2', userId: 'user_master', testName: 'Pull-Up Max (Strict)', category: 'Strength', unit: 'reps', value: 21, date: d(7) },
    { id: 't_3', userId: 'user_master', testName: 'Vertical Jump', category: 'Power', unit: 'cm', value: 68, date: d(14) },
    { id: 't_4', userId: 'user_master', testName: '100m Sprint', category: 'Speed', unit: 's', value: 12.1, date: d(21) },
    { id: 't_5', userId: 'user_master', testName: 'Plank Hold', category: 'Endurance', unit: 'min', value: 3.5, date: d(10) }
  ];

  const goals: Goal[] = [
    { id: 'g_1', userId: 'user_master', title: 'Cut to Target Weight', category: 'weight', startValue: 85.5, currentValue: 83.2, targetValue: 82.0, unit: 'kg', startDate: d(30), status: 'active' },
    { id: 'g_2', userId: 'user_master', title: 'Break 120kg Bench Press 1RM', category: 'strength', startValue: 110, currentValue: 124.7, targetValue: 130, unit: 'kg (est 1RM)', startDate: d(60), status: 'active' },
    { id: 'g_3', userId: 'user_master', title: 'Sub-24:00 5K Time', category: 'distance', startValue: 1620, currentValue: 1500, targetValue: 1440, unit: 's', startDate: d(45), status: 'active' }
  ];

  const calendar: PlannedSession[] = [
    { id: 'cal_1', userId: 'user_master', date: d(0), title: 'Recovery Mobility & Zone 2 Walk', type: 'mobility', completed: true },
    { id: 'cal_2', userId: 'user_master', date: d(-1), title: 'Push Hypertrophy', type: 'workout', completed: false },
    { id: 'cal_3', userId: 'user_master', date: d(-2), title: 'Tempo 8K Run', type: 'run', completed: false },
    { id: 'cal_4', userId: 'user_master', date: d(-3), title: 'Posterior Chain Deadlifts', type: 'workout', completed: false }
  ];

  return { workouts, runs, metrics, prs, wellness, tests, goals, calendar };
}
