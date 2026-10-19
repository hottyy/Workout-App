import React, { useState } from 'react';
import { X, Dumbbell, Activity, Scale, HeartPulse } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { RunType } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkoutNow: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ 
  isOpen, 
  onClose,
  onStartWorkoutNow 
}) => {
  const { saveRun, saveMetric, saveWellness, profile } = useFitness();
  const [activeTab, setActiveTab] = useState<'menu' | 'quick_run' | 'quick_metric' | 'quick_wellness'>('menu');

  // Quick Run form state
  const [runDistance, setRunDistance] = useState('5.0');
  const [runDurationMin, setRunDurationMin] = useState('25');
  const [runType, setRunType] = useState<RunType>('easy');

  // Quick Metric form state
  const [bodyWeight, setBodyWeight] = useState(profile.weightGoalKg?.toString() || '82');
  const [bodyFat, setBodyFat] = useState('');

  // Quick Wellness form state
  const [sleepHours, setSleepHours] = useState('7.5');
  const [energyScore, setEnergyScore] = useState(4);
  const [sorenessScore, setSorenessScore] = useState(2);

  if (!isOpen) return null;

  const handleSaveRun = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(runDistance) || 0;
    const durSec = (parseFloat(runDurationMin) || 0) * 60;
    if (dist <= 0 || durSec <= 0) return;

    const pace = durSec / dist;
    const speed = dist / (durSec / 3600);

    saveRun({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      distanceKm: dist,
      durationSeconds: durSec,
      avgPaceSecondsPerKm: pace,
      avgSpeedKmh: Math.round(speed * 100) / 100,
      runType,
      isGpsTracked: false
    });

    onClose();
    setActiveTab('menu');
  };

  const handleSaveMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(bodyWeight) || 0;
    if (wt <= 0) return;

    saveMetric({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      weightKg: wt,
      heightCm: profile.heightCm,
      bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined
    });

    onClose();
    setActiveTab('menu');
  };

  const handleSaveWellness = (e: React.FormEvent) => {
    e.preventDefault();
    saveWellness({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      sleepDurationHours: parseFloat(sleepHours) || 8,
      sleepQuality: 4,
      energyLevel: energyScore,
      sorenessLevel: sorenessScore,
      stressLevel: 2,
      motivationLevel: 4
    });

    onClose();
    setActiveTab('menu');
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="quick-action-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-forge-surface border border-forge-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-forge-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {activeTab === 'menu' && (
          <div>
            <h3 id="quick-action-title" className="text-lg font-black text-white">Record Fitness Activity</h3>
            <p className="text-xs text-forge-muted mt-1">Select an event or check-in to log immediately.</p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  onClose();
                  onStartWorkoutNow();
                }}
                aria-label="Launch Live Workout"
                className="p-4 rounded-xl bg-forge-card hover:bg-forge-border/60 border border-forge-border flex flex-col items-start gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-forge-accent/20 border border-forge-accent/40 flex items-center justify-center text-forge-accent group-hover:scale-105 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Live Workout</h4>
                  <p className="text-[11px] text-forge-muted">Real-time sets & rest timer</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('quick_run')}
                aria-label="Log Run Session"
                className="p-4 rounded-xl bg-forge-card hover:bg-forge-border/60 border border-forge-border flex flex-col items-start gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-forge-success/20 border border-forge-success/40 flex items-center justify-center text-forge-success group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Log Run Session</h4>
                  <p className="text-[11px] text-forge-muted">Distance, duration & pace</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('quick_metric')}
                aria-label="Log Weigh-in"
                className="p-4 rounded-xl bg-forge-card hover:bg-forge-border/60 border border-forge-border flex flex-col items-start gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Body Weigh-in</h4>
                  <p className="text-[11px] text-forge-muted">Weight & measurements</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('quick_wellness')}
                aria-label="Log Wellness Check"
                className="p-4 rounded-xl bg-forge-card hover:bg-forge-border/60 border border-forge-border flex flex-col items-start gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Wellness Check</h4>
                  <p className="text-[11px] text-forge-muted">Sleep, soreness & energy</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quick_run' && (
          <form onSubmit={handleSaveRun}>
            <div className="flex items-center gap-2 mb-4">
              <button 
                type="button" 
                onClick={() => setActiveTab('menu')}
                className="text-xs text-forge-accent hover:underline font-semibold"
              >
                ← Back
              </button>
              <h3 className="text-sm font-bold text-white">Log Run Entry</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="quick-run-distance" className="text-xs text-forge-muted block mb-1">Distance (km)</label>
                <input
                  id="quick-run-distance"
                  type="number"
                  step="0.01"
                  required
                  value={runDistance}
                  onChange={e => setRunDistance(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                />
              </div>

              <div>
                <label htmlFor="quick-run-duration" className="text-xs text-forge-muted block mb-1">Duration (minutes)</label>
                <input
                  id="quick-run-duration"
                  type="number"
                  step="0.5"
                  required
                  value={runDurationMin}
                  onChange={e => setRunDurationMin(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                />
              </div>

              <div>
                <label htmlFor="quick-run-type" className="text-xs text-forge-muted block mb-1">Run Intensity / Type</label>
                <select
                  id="quick-run-type"
                  value={runType}
                  onChange={e => setRunType(e.target.value as RunType)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                >
                  <option value="easy">Easy Aerobic</option>
                  <option value="tempo">Tempo Run</option>
                  <option value="interval">Speed Intervals</option>
                  <option value="long">Long Run</option>
                  <option value="recovery">Recovery Jog</option>
                </select>
              </div>

              <button
                type="submit"
                aria-label="Submit Run Session"
                className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-forge-accent/25 transition-all mt-4"
              >
                Save Run Session
              </button>
            </div>
          </form>
        )}

        {activeTab === 'quick_metric' && (
          <form onSubmit={handleSaveMetric}>
            <div className="flex items-center gap-2 mb-4">
              <button 
                type="button" 
                onClick={() => setActiveTab('menu')}
                className="text-xs text-forge-accent hover:underline font-semibold"
              >
                ← Back
              </button>
              <h3 className="text-sm font-bold text-white">Record Weigh-In</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="quick-weight" className="text-xs text-forge-muted block mb-1">Body Weight (kg)</label>
                <input
                  id="quick-weight"
                  type="number"
                  step="0.1"
                  required
                  value={bodyWeight}
                  onChange={e => setBodyWeight(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                />
              </div>

              <div>
                <label htmlFor="quick-fat" className="text-xs text-forge-muted block mb-1">Body Fat % (Optional)</label>
                <input
                  id="quick-fat"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 14.5"
                  value={bodyFat}
                  onChange={e => setBodyFat(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                />
              </div>

              <button
                type="submit"
                aria-label="Submit Weigh-In"
                className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs tracking-wide transition-all mt-4"
              >
                Save Weigh-In
              </button>
            </div>
          </form>
        )}

        {activeTab === 'quick_wellness' && (
          <form onSubmit={handleSaveWellness}>
            <div className="flex items-center gap-2 mb-4">
              <button 
                type="button" 
                onClick={() => setActiveTab('menu')}
                className="text-xs text-forge-accent hover:underline font-semibold"
              >
                ← Back
              </button>
              <h3 className="text-sm font-bold text-white">Daily Wellness Check-In</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="quick-sleep" className="text-xs text-forge-muted block mb-1">Sleep Duration (Hours)</label>
                <input
                  id="quick-sleep"
                  type="number"
                  step="0.1"
                  value={sleepHours}
                  onChange={e => setSleepHours(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-forge-muted block mb-1">Energy Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      aria-label={`Energy level ${v}`}
                      onClick={() => setEnergyScore(v)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        energyScore === v 
                          ? 'bg-forge-accent border-forge-accent text-white' 
                          : 'bg-forge-card border-forge-border text-forge-muted'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-forge-muted block mb-1">Muscle Soreness (1 = Fresh, 5 = Severe)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      aria-label={`Soreness level ${v}`}
                      onClick={() => setSorenessScore(v)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        sorenessScore === v 
                          ? 'bg-forge-danger border-forge-danger text-white' 
                          : 'bg-forge-card border-forge-border text-forge-muted'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                aria-label="Submit Wellness Record"
                className="w-full py-2.5 rounded-xl bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs tracking-wide transition-all mt-4"
              >
                Save Wellness Record
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
