import React, { useState } from 'react';
import { HeartPulse, Moon, Zap, ShieldAlert } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const RecoveryTracker: React.FC = () => {
  const { wellnessLogs, saveWellness, profile } = useFitness();

  const [sleepHrs, setSleepHrs] = useState('8.0');
  const [sleepQual, setSleepQual] = useState(4);
  const [energy, setEnergy] = useState(4);
  const [soreness, setSoreness] = useState(2);
  const [stress, setStress] = useState(2);
  const [rhr, setRhr] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWellness({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      sleepDurationHours: parseFloat(sleepHrs) || 8,
      sleepQuality: sleepQual,
      energyLevel: energy,
      sorenessLevel: soreness,
      stressLevel: stress,
      motivationLevel: 4,
      restingHeartRate: rhr ? parseInt(rhr, 10) : undefined
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-2">Daily Autoregulation & Wellness Check-In</h3>
        <p className="text-xs text-forge-muted mb-4">
          Tracking subjective sleep and neuromuscular soreness assists recovery pacing. Inputs are subjective tools and not diagnostic medical scores.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recovery-sleep-hrs" className="text-xs text-forge-muted block mb-1">Sleep Duration (Hours)</label>
              <input
                id="recovery-sleep-hrs"
                type="number"
                step="0.1"
                required
                value={sleepHrs}
                onChange={e => setSleepHrs(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="recovery-rhr" className="text-xs text-forge-muted block mb-1">Resting Heart Rate (bpm, optional)</label>
              <input
                id="recovery-rhr"
                type="number"
                placeholder="e.g. 52"
                value={rhr}
                onChange={e => setRhr(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-forge-muted block mb-1">Sleep Quality (1-5)</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`Sleep quality ${v}`}
                    onClick={() => setSleepQual(v)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                      sleepQual === v ? 'bg-forge-accent text-white' : 'bg-forge-card text-forge-muted border border-forge-border'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-forge-muted block mb-1">Energy Rating (1-5)</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`Energy rating ${v}`}
                    onClick={() => setEnergy(v)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                      energy === v ? 'bg-forge-success text-white' : 'bg-forge-card text-forge-muted border border-forge-border'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-forge-muted block mb-1">Soreness (1 = Fresh, 5 = High)</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`Soreness rating ${v}`}
                    onClick={() => setSoreness(v)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                      soreness === v ? 'bg-forge-danger text-white' : 'bg-forge-card text-forge-muted border border-forge-border'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-forge-accent/20 transition-all"
          >
            Submit Wellness Check-In
          </button>
        </form>
      </div>

      {/* Wellness log history */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h4 className="text-sm font-bold text-white mb-3">Recent Daily Records</h4>
        <div className="space-y-2">
          {wellnessLogs.map(l => (
            <div key={l.id} className="p-3 bg-forge-card border border-forge-border rounded-lg flex items-center justify-between text-xs">
              <span className="font-bold text-white">{l.date}</span>
              <span className="text-forge-muted">Sleep: <strong className="text-white">{l.sleepDurationHours} hrs</strong></span>
              <span className="text-forge-muted">Energy: <strong className="text-forge-success">{l.energyLevel}/5</strong></span>
              <span className="text-forge-muted">Soreness: <strong className="text-amber-400">{l.sorenessLevel}/5</strong></span>
              {l.restingHeartRate && (
                <span className="text-forge-muted">RHR: <strong className="text-purple-400">{l.restingHeartRate} bpm</strong></span>
              )}
            </div>
          ))}

          {wellnessLogs.length === 0 && (
            <p className="py-6 text-center text-forge-muted text-xs">
              No wellness check-ins recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
