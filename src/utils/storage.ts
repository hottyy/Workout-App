import { 
  UserProfile, Workout, BodyMetricEntry, RunLog, 
  AthleticTest, WellnessCheckIn, PersonalRecord, Goal, 
  PlannedSession, Exercise 
} from '../types';

export const STORAGE_KEYS = {
  PROFILE: 'forge_profile_v1',
  WORKOUTS: 'forge_workouts_v1',
  METRICS: 'forge_metrics_v1',
  RUNS: 'forge_runs_v1',
  TESTS: 'forge_tests_v1',
  WELLNESS: 'forge_wellness_v1',
  PRS: 'forge_prs_v1',
  GOALS: 'forge_goals_v1',
  CALENDAR: 'forge_calendar_v1',
  EXERCISES: 'forge_exercises_v1',
};

export const StorageEngine = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Storage read error for key: ${key}`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage write error for key: ${key}`, e);
    }
  },

  exportAllDataJSON(): string {
    const backup: Record<string, unknown> = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      backup[name] = StorageEngine.get(key, null);
    });
    return JSON.stringify(backup, null, 2);
  },

  exportWorkoutsCSV(): string {
    const workouts = StorageEngine.get<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
    const rows = [
      ['Workout ID', 'Date', 'Name', 'Duration (min)', 'Volume (kg)', 'Exercises Count']
    ];
    workouts.forEach(w => {
      rows.push([
        w.id,
        w.startTime,
        `"${w.name.replace(/"/g, '""')}"`,
        (w.durationSeconds / 60).toFixed(1),
        w.totalVolumeKg.toFixed(1),
        w.sessions.length.toString()
      ]);
    });
    return rows.map(r => r.join(',')).join('\n');
  },

  exportRunsCSV(): string {
    const runs = StorageEngine.get<RunLog[]>(STORAGE_KEYS.RUNS, []);
    const rows = [
      ['Run ID', 'Date', 'Distance (km)', 'Duration (min)', 'Avg Pace (min/km)', 'Avg Speed (km/h)', 'Type']
    ];
    runs.forEach(r => {
      const paceMin = Math.floor(r.avgPaceSecondsPerKm / 60);
      const paceSec = Math.round(r.avgPaceSecondsPerKm % 60);
      rows.push([
        r.id,
        r.date,
        r.distanceKm.toFixed(2),
        (r.durationSeconds / 60).toFixed(1),
        `"${paceMin}:${paceSec.toString().padStart(2, '0')}"`,
        r.avgSpeedKmh.toFixed(2),
        r.runType
      ]);
    });
    return rows.map(r => r.join(',')).join('\n');
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
