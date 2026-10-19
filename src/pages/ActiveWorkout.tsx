import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Plus, Trash2, Check, Clock, Timer, RotateCcw } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { WorkoutSet, ExerciseSession, SetType } from '../types';
import { formatDuration, calculateWorkingVolume } from '../utils/calculations';

export const ActiveWorkout: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { exercises, saveWorkout } = useFitness();

  const [workoutName, setWorkoutName] = useState('Heavy Bench & Upper Body');
  const [isActive, setIsActive] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest Timer state
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [restInitialSeconds, setRestInitialSeconds] = useState(90);

  const [sessions, setSessions] = useState<ExerciseSession[]>([
    {
      exerciseId: 'ex_1',
      exerciseName: 'Barbell Bench Press',
      category: 'Chest',
      sets: [
        { id: '1', setNumber: 1, type: 'warmup', weight: 60, reps: 10, completed: true },
        { id: '2', setNumber: 2, type: 'working', weight: 100, reps: 5, rpe: 8, completed: false },
        { id: '3', setNumber: 3, type: 'working', weight: 105, reps: 5, rpe: 8.5, completed: false }
      ]
    }
  ]);

  const [selectedExId, setSelectedExId] = useState(exercises[0]?.id || 'ex_1');

  // Workout duration stopwatch
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive) {
      timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);

  // Rest timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (restTimerSeconds !== null && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimerSeconds]);

  const startRestTimer = (seconds: number) => {
    setRestInitialSeconds(seconds);
    setRestTimerSeconds(seconds);
  };

  const stopRestTimer = () => {
    setRestTimerSeconds(null);
  };

  const handleAddExercise = () => {
    const ex = exercises.find(e => e.id === selectedExId);
    if (!ex) return;

    setSessions(prev => [
      ...prev,
      {
        exerciseId: ex.id,
        exerciseName: ex.name,
        category: ex.category,
        sets: [
          { id: `s_${Date.now()}`, setNumber: 1, type: 'working', weight: 60, reps: 8, completed: false }
        ]
      }
    ]);
  };

  const handleAddSet = (sessionIndex: number) => {
    setSessions(prev => {
      const copy = [...prev];
      const target = copy[sessionIndex];
      const lastSet = target.sets[target.sets.length - 1];
      const newSet: WorkoutSet = {
        id: `set_${Date.now()}_${Math.random()}`,
        setNumber: target.sets.length + 1,
        type: 'working',
        weight: lastSet ? lastSet.weight : 50,
        reps: lastSet ? lastSet.reps : 8,
        completed: false
      };
      target.sets.push(newSet);
      return copy;
    });
  };

  const handleUpdateSet = (sessionIndex: number, setIndex: number, field: keyof WorkoutSet, val: unknown) => {
    setSessions(prev => {
      const copy = [...prev];
      copy[sessionIndex].sets[setIndex] = {
        ...copy[sessionIndex].sets[setIndex],
        [field]: val
      };
      return copy;
    });
  };

  const handleDeleteSet = (sessionIndex: number, setIndex: number) => {
    setSessions(prev => {
      const copy = [...prev];
      copy[sessionIndex].sets.splice(setIndex, 1);
      // Re-index remaining sets
      copy[sessionIndex].sets.forEach((s, idx) => {
        s.setNumber = idx + 1;
      });
      return copy;
    });
  };

  const handleToggleComplete = (sessionIndex: number, setIndex: number) => {
    const currentCompleted = sessions[sessionIndex].sets[setIndex].completed;
    handleUpdateSet(sessionIndex, setIndex, 'completed', !currentCompleted);

    // If marking as completed, offer auto rest timer
    if (!currentCompleted) {
      startRestTimer(90);
    }
  };

  // Live Working Volume sum
  const currentWorkingVolume = sessions.reduce((acc, sess) => {
    return acc + calculateWorkingVolume(sess.sets);
  }, 0);

  const handleFinish = () => {
    // Total Volume strictly sums completed working sets
    let totalVol = 0;
    sessions.forEach(sess => {
      totalVol += calculateWorkingVolume(sess.sets);
    });

    saveWorkout({
      userId: 'user_master',
      name: workoutName,
      startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      sessions,
      totalVolumeKg: totalVol,
      notes: 'Recorded via live session logger'
    });

    onFinish();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live HUD Card */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <label htmlFor="active-workout-name" className="sr-only">Workout Name</label>
          <input
            id="active-workout-name"
            type="text"
            value={workoutName}
            onChange={e => setWorkoutName(e.target.value)}
            className="text-lg lg:text-xl font-black text-white bg-transparent outline-none border-b border-transparent focus:border-forge-accent transition-colors"
          />
          <div className="flex items-center gap-3 text-xs text-forge-muted mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-forge-accent" />
              <span className="font-mono font-semibold text-white">{formatDuration(elapsedSeconds)}</span>
            </span>
            <span>•</span>
            <span>Working Volume: <strong className="text-forge-accent">{currentWorkingVolume} kg</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            aria-label={isActive ? "Pause workout timer" : "Resume workout timer"}
            className="p-2.5 rounded-xl border border-forge-border text-forge-muted hover:text-white hover:bg-forge-card transition-colors"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-forge-success" />}
          </button>

          <button
            onClick={handleFinish}
            aria-label="Finish and Save Workout"
            className="px-5 py-2.5 rounded-xl bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs tracking-wider shadow-lg shadow-forge-accent/25 transition-all flex items-center gap-2"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Rest Timer Drawer */}
      {restTimerSeconds !== null && (
        <div className="bg-forge-card border border-forge-accent/40 rounded-xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forge-accent/20 border border-forge-accent/40 flex items-center justify-center text-forge-accent">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-forge-muted uppercase font-bold tracking-wider">Active Rest Interval</p>
              <p className="text-xl font-black font-mono text-white">
                {formatDuration(restTimerSeconds)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[60, 90, 120, 180].map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => startRestTimer(sec)}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                  restInitialSeconds === sec
                    ? 'bg-forge-accent border-forge-accent text-white'
                    : 'bg-forge-surface border-forge-border text-forge-muted hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
            <button
              onClick={stopRestTimer}
              className="p-1.5 text-forge-muted hover:text-white"
              title="Stop Rest Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Exercises Stack */}
      <div className="space-y-5">
        {sessions.map((sess, sIdx) => (
          <div key={sess.exerciseId + sIdx} className="bg-forge-surface border border-forge-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">{sess.exerciseName}</h3>
                <span className="text-[10px] text-forge-muted uppercase tracking-wider font-semibold">
                  {sess.category}
                </span>
              </div>
            </div>

            {/* Sets Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-forge-muted uppercase border-b border-forge-border/60">
                    <th className="pb-2 w-12">Set</th>
                    <th className="pb-2 w-28">Type</th>
                    <th className="pb-2">Weight (kg)</th>
                    <th className="pb-2">Reps</th>
                    <th className="pb-2 w-20">RPE</th>
                    <th className="pb-2 text-center w-16">Done</th>
                    <th className="pb-2 text-right w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forge-border/30">
                  {sess.sets.map((set, setIdx) => (
                    <tr key={set.id} className={set.completed ? 'bg-forge-card/40' : ''}>
                      <td className="py-2.5 font-bold text-white">{set.setNumber}</td>
                      <td className="py-2.5">
                        <select
                          aria-label={`Set ${set.setNumber} type`}
                          value={set.type}
                          onChange={e => handleUpdateSet(sIdx, setIdx, 'type', e.target.value as SetType)}
                          className="bg-forge-card border border-forge-border rounded px-2 py-1 text-[11px] text-white outline-none"
                        >
                          <option value="warmup">Warm-up</option>
                          <option value="working">Working</option>
                          <option value="dropset">Drop Set</option>
                        </select>
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          step="0.5"
                          aria-label={`Set ${set.setNumber} weight in kg`}
                          value={set.weight}
                          onChange={e => handleUpdateSet(sIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-20 bg-forge-card border border-forge-border rounded px-2 py-1 text-white font-mono outline-none focus:border-forge-accent"
                        />
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          aria-label={`Set ${set.setNumber} repetitions`}
                          value={set.reps}
                          onChange={e => handleUpdateSet(sIdx, setIdx, 'reps', parseInt(e.target.value, 10) || 0)}
                          className="w-16 bg-forge-card border border-forge-border rounded px-2 py-1 text-white font-mono outline-none focus:border-forge-accent"
                        />
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          step="0.5"
                          min="6"
                          max="10"
                          placeholder="8"
                          aria-label={`Set ${set.setNumber} RPE`}
                          value={set.rpe || ''}
                          onChange={e => handleUpdateSet(sIdx, setIdx, 'rpe', parseFloat(e.target.value) || undefined)}
                          className="w-14 bg-forge-card border border-forge-border rounded px-2 py-1 text-white font-mono outline-none focus:border-forge-accent"
                        />
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          type="button"
                          aria-label={`Mark set ${set.setNumber} complete`}
                          onClick={() => handleToggleComplete(sIdx, setIdx)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors mx-auto ${
                            set.completed 
                              ? 'bg-forge-success text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                              : 'border border-forge-border text-forge-muted hover:text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          aria-label={`Delete set ${set.setNumber}`}
                          onClick={() => handleDeleteSet(sIdx, setIdx)}
                          className="text-forge-muted hover:text-forge-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleAddSet(sIdx)}
              aria-label={`Add set to ${sess.exerciseName}`}
              className="mt-3 text-xs font-semibold text-forge-accent hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Add New Exercise Bar */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <label htmlFor="select-exercise" className="sr-only">Select Exercise to Add</label>
        <select
          id="select-exercise"
          value={selectedExId}
          onChange={e => setSelectedExId(e.target.value)}
          className="flex-1 bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
        >
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.category} • {ex.equipment})
            </option>
          ))}
        </select>

        <button
          onClick={handleAddExercise}
          aria-label="Insert Exercise into Workout"
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-forge-accent" />
          <span>Insert Exercise</span>
        </button>
      </div>
    </div>
  );
};
