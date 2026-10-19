import React, { useState } from 'react';
import { Download, Trash2, Sparkles, Check } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { StorageEngine } from '../utils/storage';

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, resetAllData, loadSampleData } = useFitness();

  const [name, setName] = useState(profile.displayName);
  const [height, setHeight] = useState(profile.heightCm.toString());
  const [weightGoal, setWeightGoal] = useState(profile.weightGoalKg?.toString() || '82');
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(profile.weeklyWorkoutTarget.toString());
  const [weeklyRuns, setWeeklyRuns] = useState(profile.weeklyRunningDistanceTargetKm.toString());
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: name,
      heightCm: parseFloat(height) || 180,
      weightGoalKg: parseFloat(weightGoal) || 82,
      weeklyWorkoutTarget: parseInt(weeklyWorkouts, 10) || 5,
      weeklyRunningDistanceTargetKm: parseFloat(weeklyRuns) || 25
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = StorageEngine.exportAllDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge_athletic_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWorkoutsCSV = () => {
    const csvStr = StorageEngine.exportWorkoutsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge_workouts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportRunsCSV = () => {
    const csvStr = StorageEngine.exportRunsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge_runs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Form */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Athlete Bio & Targets</h3>
          {savedAlert && (
            <span className="text-xs font-bold text-forge-success flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="athlete-name" className="text-xs text-forge-muted block mb-1">Display Name</label>
            <input
              id="athlete-name"
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="athlete-height" className="text-xs text-forge-muted block mb-1">Height (cm)</label>
              <input
                id="athlete-height"
                type="number"
                required
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="athlete-weight-goal" className="text-xs text-forge-muted block mb-1">Target Weight (kg)</label>
              <input
                id="athlete-weight-goal"
                type="number"
                step="0.1"
                required
                value={weightGoal}
                onChange={e => setWeightGoal(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weekly-workouts-target" className="text-xs text-forge-muted block mb-1">Weekly Strength Sessions Target</label>
              <input
                id="weekly-workouts-target"
                type="number"
                min="1"
                max="14"
                required
                value={weeklyWorkouts}
                onChange={e => setWeeklyWorkouts(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="weekly-runs-target" className="text-xs text-forge-muted block mb-1">Weekly Running Mileage Target (km)</label>
              <input
                id="weekly-runs-target"
                type="number"
                step="0.5"
                min="0"
                required
                value={weeklyRuns}
                onChange={e => setWeeklyRuns(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Data Export & Backup Hub */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-2">Data Portability & Backups</h3>
        <p className="text-xs text-forge-muted mb-4">
          All performance metrics are stored locally and can be downloaded at any time in standardized formats.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJSON}
            aria-label="Export JSON Database"
            className="px-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-forge-accent" />
            <span>Export JSON Database</span>
          </button>
          <button
            onClick={handleExportWorkoutsCSV}
            aria-label="Export Workouts CSV"
            className="px-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-forge-success" />
            <span>Export Workouts CSV</span>
          </button>
          <button
            onClick={handleExportRunsCSV}
            aria-label="Export Runs CSV"
            className="px-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-forge-success" />
            <span>Export Runs CSV</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-forge-surface border border-forge-danger/30 rounded-xl p-5">
        <h3 className="text-base font-bold text-forge-danger mb-2">Data Reset Zone</h3>
        <p className="text-xs text-forge-muted mb-4">
          Wipe all workout, run, and body metric history, or restore the athletic demo dataset.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (window.confirm('Clear all local data? This cannot be undone.')) {
                resetAllData();
              }
            }}
            aria-label="Wipe all local data"
            className="px-4 py-2 rounded-lg bg-forge-danger/10 hover:bg-forge-danger/20 border border-forge-danger/40 text-forge-danger text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Local Data</span>
          </button>
          <button
            onClick={loadSampleData}
            aria-label="Re-populate Demo Dataset"
            className="px-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-white text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-forge-accent" />
            <span>Re-populate Demo Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
