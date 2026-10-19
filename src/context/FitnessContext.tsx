import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Workout, BodyMetricEntry, RunLog, 
  AthleticTest, WellnessCheckIn, PersonalRecord, Goal, 
  PlannedSession, Exercise 
} from '../types';
import { StorageEngine, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_EXERCISES, INITIAL_PROFILE, generateSampleAthleticDataset } from '../utils/sampleData';
import { calculateBMI, calculateEpley1RM } from '../utils/calculations';

export interface PendingPRAlert {
  exerciseName: string;
  type: PersonalRecord['type'];
  newValue: number;
  oldValue?: number;
  formattedText: string;
  formulaNote?: string;
}

interface FitnessContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  exercises: Exercise[];
  addCustomExercise: (ex: Omit<Exercise, 'id' | 'isCustom'>) => Exercise;
  workouts: Workout[];
  saveWorkout: (workout: Omit<Workout, 'id'>) => Workout;
  deleteWorkout: (id: string) => void;
  runs: RunLog[];
  saveRun: (run: Omit<RunLog, 'id'>) => RunLog;
  deleteRun: (id: string) => void;
  bodyMetrics: BodyMetricEntry[];
  saveMetric: (entry: Omit<BodyMetricEntry, 'id' | 'bmi'>) => void;
  deleteMetric: (id: string) => void;
  prs: PersonalRecord[];
  confirmPR: (pr: Omit<PersonalRecord, 'id' | 'userId'>) => void;
  dismissPRAlert: () => void;
  pendingPR: PendingPRAlert | null;
  wellnessLogs: WellnessCheckIn[];
  saveWellness: (entry: Omit<WellnessCheckIn, 'id'>) => void;
  athleticTests: AthleticTest[];
  saveAthleticTest: (test: Omit<AthleticTest, 'id'>) => void;
  deleteAthleticTest: (id: string) => void;
  goals: Goal[];
  saveGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalStatus: (id: string, status: Goal['status']) => void;
  calendarSessions: PlannedSession[];
  toggleCalendarSession: (id: string) => void;
  addCalendarSession: (session: Omit<PlannedSession, 'id' | 'userId'>) => void;
  loadSampleData: () => void;
  resetAllData: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => 
    StorageEngine.get(STORAGE_KEYS.PROFILE, INITIAL_PROFILE)
  );

  const [exercises, setExercises] = useState<Exercise[]>(() => 
    StorageEngine.get(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES)
  );

  const [workouts, setWorkouts] = useState<Workout[]>(() => 
    StorageEngine.get(STORAGE_KEYS.WORKOUTS, [])
  );

  const [runs, setRuns] = useState<RunLog[]>(() => 
    StorageEngine.get(STORAGE_KEYS.RUNS, [])
  );

  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricEntry[]>(() => 
    StorageEngine.get(STORAGE_KEYS.METRICS, [])
  );

  const [prs, setPRs] = useState<PersonalRecord[]>(() => 
    StorageEngine.get(STORAGE_KEYS.PRS, [])
  );

  const [wellnessLogs, setWellnessLogs] = useState<WellnessCheckIn[]>(() => 
    StorageEngine.get(STORAGE_KEYS.WELLNESS, [])
  );

  const [athleticTests, setAthleticTests] = useState<AthleticTest[]>(() => 
    StorageEngine.get(STORAGE_KEYS.TESTS, [])
  );

  const [goals, setGoals] = useState<Goal[]>(() => 
    StorageEngine.get(STORAGE_KEYS.GOALS, [])
  );

  const [calendarSessions, setCalendarSessions] = useState<PlannedSession[]>(() => 
    StorageEngine.get(STORAGE_KEYS.CALENDAR, [])
  );

  const [pendingPR, setPendingPR] = useState<PendingPRAlert | null>(null);

  // Sync state changes to storage
  useEffect(() => StorageEngine.set(STORAGE_KEYS.PROFILE, profile), [profile]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.EXERCISES, exercises), [exercises]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.WORKOUTS, workouts), [workouts]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.RUNS, runs), [runs]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.METRICS, bodyMetrics), [bodyMetrics]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.PRS, prs), [prs]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.WELLNESS, wellnessLogs), [wellnessLogs]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.TESTS, athleticTests), [athleticTests]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.GOALS, goals), [goals]);
  useEffect(() => StorageEngine.set(STORAGE_KEYS.CALENDAR, calendarSessions), [calendarSessions]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addCustomExercise = (ex: Omit<Exercise, 'id' | 'isCustom'>): Exercise => {
    const newEx: Exercise = {
      ...ex,
      id: `custom_${Date.now()}`,
      isCustom: true
    };
    setExercises(prev => [...prev, newEx]);
    return newEx;
  };

  const saveWorkout = (workoutData: Omit<Workout, 'id'>): Workout => {
    const newWorkout: Workout = {
      ...workoutData,
      id: `workout_${Date.now()}`
    };

    setWorkouts(prev => [newWorkout, ...prev]);

    // Check for potential personal records in working sets
    workoutData.sessions.forEach(session => {
      session.sets.forEach(set => {
        if (!set.completed || set.type === 'warmup') return;

        // 1. Heaviest Weight PR check
        const currentHeaviestPR = prs.find(
          p => p.exerciseName.toLowerCase() === session.exerciseName.toLowerCase() && p.type === 'heaviest_weight'
        );
        if (!currentHeaviestPR || set.weight > currentHeaviestPR.value) {
          setPendingPR({
            exerciseName: session.exerciseName,
            type: 'heaviest_weight',
            newValue: set.weight,
            oldValue: currentHeaviestPR?.value,
            formattedText: `${set.weight} kg (${set.reps} reps)`,
          });
        }

        // 2. Estimated 1RM check via Epley Formula
        const est1RM = calculateEpley1RM(set.weight, set.reps);
        if (est1RM > 0) {
          const current1RM_PR = prs.find(
            p => p.exerciseName.toLowerCase() === session.exerciseName.toLowerCase() && p.type === 'estimated_1rm'
          );
          if (!current1RM_PR || est1RM > current1RM_PR.value) {
            setPendingPR({
              exerciseName: session.exerciseName,
              type: 'estimated_1rm',
              newValue: est1RM,
              oldValue: current1RM_PR?.value,
              formattedText: `${est1RM} kg`,
              formulaNote: `Epley formula: ${set.weight}kg × (1 + ${set.reps}/30)`
            });
          }
        }
      });
    });

    return newWorkout;
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const saveRun = (runData: Omit<RunLog, 'id'>): RunLog => {
    const newRun: RunLog = {
      ...runData,
      id: `run_${Date.now()}`
    };

    setRuns(prev => [newRun, ...prev]);

    // Check 5K PR
    if (runData.distanceKm >= 5.0) {
      const best5k = prs.find(p => p.exerciseName.includes('5K') && p.type === 'fastest_run');
      if (!best5k || runData.durationSeconds < best5k.value) {
        const mins = Math.floor(runData.durationSeconds / 60);
        const secs = Math.round(runData.durationSeconds % 60);
        setPendingPR({
          exerciseName: '5K Run Milestone',
          type: 'fastest_run',
          newValue: runData.durationSeconds,
          oldValue: best5k?.value,
          formattedText: `${mins}:${secs.toString().padStart(2, '0')}`,
        });
      }
    }

    return newRun;
  };

  const deleteRun = (id: string) => {
    setRuns(prev => prev.filter(r => r.id !== id));
  };

  const saveMetric = (entryData: Omit<BodyMetricEntry, 'id' | 'bmi'>) => {
    const calculatedBmi = calculateBMI(entryData.weightKg, entryData.heightCm);
    const newMetric: BodyMetricEntry = {
      ...entryData,
      id: `metric_${Date.now()}`,
      bmi: calculatedBmi
    };
    setBodyMetrics(prev => [newMetric, ...prev]);
  };

  const deleteMetric = (id: string) => {
    setBodyMetrics(prev => prev.filter(m => m.id !== id));
  };

  const confirmPR = (prData: Omit<PersonalRecord, 'id' | 'userId'>) => {
    const newPR: PersonalRecord = {
      ...prData,
      id: `pr_${Date.now()}`,
      userId: profile.id
    };
    setPRs(prev => [
      newPR, 
      ...prev.filter(p => !(p.exerciseName === newPR.exerciseName && p.type === newPR.type))
    ]);
    setPendingPR(null);
  };

  const dismissPRAlert = () => setPendingPR(null);

  const saveWellness = (entry: Omit<WellnessCheckIn, 'id'>) => {
    const newLog: WellnessCheckIn = {
      ...entry,
      id: `wel_${Date.now()}`
    };
    setWellnessLogs(prev => [newLog, ...prev]);
  };

  const saveAthleticTest = (test: Omit<AthleticTest, 'id'>) => {
    const newTest: AthleticTest = {
      ...test,
      id: `test_${Date.now()}`
    };
    setAthleticTests(prev => [newTest, ...prev]);
  };

  const deleteAthleticTest = (id: string) => {
    setAthleticTests(prev => prev.filter(t => t.id !== id));
  };

  const saveGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalStatus = (id: string, status: Goal['status']) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  };

  const toggleCalendarSession = (id: string) => {
    setCalendarSessions(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const addCalendarSession = (session: Omit<PlannedSession, 'id' | 'userId'>) => {
    const newSession: PlannedSession = {
      ...session,
      id: `cal_${Date.now()}`,
      userId: profile.id
    };
    setCalendarSessions(prev => [...prev, newSession]);
  };

  const loadSampleData = () => {
    const sample = generateSampleAthleticDataset();
    setWorkouts(sample.workouts);
    setRuns(sample.runs);
    setBodyMetrics(sample.metrics);
    setPRs(sample.prs);
    setWellnessLogs(sample.wellness);
    setAthleticTests(sample.tests);
    setGoals(sample.goals);
    setCalendarSessions(sample.calendar);
  };

  const resetAllData = () => {
    StorageEngine.clearAllData();
    setWorkouts([]);
    setRuns([]);
    setBodyMetrics([]);
    setPRs([]);
    setWellnessLogs([]);
    setAthleticTests([]);
    setGoals([]);
    setCalendarSessions([]);
  };

  return (
    <FitnessContext.Provider value={{
      profile,
      updateProfile,
      exercises,
      addCustomExercise,
      workouts,
      saveWorkout,
      deleteWorkout,
      runs,
      saveRun,
      deleteRun,
      bodyMetrics,
      saveMetric,
      deleteMetric,
      prs,
      confirmPR,
      dismissPRAlert,
      pendingPR,
      wellnessLogs,
      saveWellness,
      athleticTests,
      saveAthleticTest,
      deleteAthleticTest,
      goals,
      saveGoal,
      updateGoalStatus,
      calendarSessions,
      toggleCalendarSession,
      addCalendarSession,
      loadSampleData,
      resetAllData
    }}>
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) throw new Error('useFitness must be used within a FitnessProvider');
  return context;
};
