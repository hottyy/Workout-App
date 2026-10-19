import React, { useState } from 'react';
import { Trophy, Calendar, AlertCircle, Plus, X } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { PersonalRecord } from '../types';

export const PersonalRecords: React.FC = () => {
  const { prs, confirmPR } = useFitness();
  const [showManualPRModal, setShowManualPRModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [prType, setPRType] = useState<PersonalRecord['type']>('heaviest_weight');
  const [prValue, setPRValue] = useState('');
  const [prFormatted, setPRFormatted] = useState('');

  const handleManualPRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(prValue);
    if (!exerciseName.trim() || !val) return;

    confirmPR({
      exerciseName: exerciseName.trim(),
      type: prType,
      value: val,
      formattedValue: prFormatted.trim() || `${val}`,
      date: new Date().toISOString().split('T')[0],
      formulaNote: prType === 'estimated_1rm' ? 'Manual benchmark entry' : undefined
    });

    setExerciseName('');
    setPRValue('');
    setPRFormatted('');
    setShowManualPRModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Standards Disclaimer */}
      <div className="p-4 bg-forge-card border border-forge-border rounded-xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-forge-accent shrink-0 mt-0.5" />
          <div className="text-xs text-forge-muted leading-relaxed">
            <strong className="text-white">PR Verification Engine:</strong> Strength records are detected automatically during workouts. Estimated 1RM calculations use the verified <em>Epley Formula: Weight × (1 + Reps/30)</em>, which is restricted to sets of 1–12 repetitions.
          </div>
        </div>
        <button
          onClick={() => setShowManualPRModal(true)}
          aria-label="Add Manual PR"
          className="shrink-0 px-3 py-1.5 rounded-lg bg-forge-surface border border-forge-border hover:bg-forge-accent hover:text-white text-xs font-semibold text-forge-accent transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manual Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prs.map(pr => (
          <div key={pr.id} className="bg-forge-surface border border-forge-border rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  {pr.type.replace('_', ' ')}
                </span>
                <h4 className="text-base font-black text-white mt-2">{pr.exerciseName}</h4>
              </div>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>

            <div className="my-4">
              <span className="text-2xl font-black text-forge-success tracking-tight">{pr.formattedValue}</span>
              {pr.previousValue && (
                <p className="text-xs text-forge-muted mt-1">
                  Previous: <span className="text-gray-300 font-semibold">{pr.previousValue}</span>
                </p>
              )}
              {pr.formulaNote && (
                <p className="text-[10px] text-forge-muted font-mono mt-1">{pr.formulaNote}</p>
              )}
            </div>

            <div className="text-[10px] text-forge-muted flex items-center gap-1 border-t border-forge-border/40 pt-2">
              <Calendar className="w-3 h-3" /> Established: {pr.date}
            </div>
          </div>
        ))}

        {prs.length === 0 && (
          <div className="col-span-full py-12 text-center text-forge-muted text-xs bg-forge-surface border border-forge-border rounded-xl">
            No personal records established yet. Complete a workout or cardio run to establish initial benchmarks.
          </div>
        )}
      </div>

      {/* Manual PR Entry Modal */}
      {showManualPRModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="manual-pr-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-forge-surface border border-forge-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowManualPRModal(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-forge-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="manual-pr-title" className="text-base font-bold text-white mb-4">Record Personal Best</h3>

            <form onSubmit={handleManualPRSubmit} className="space-y-4">
              <div>
                <label htmlFor="pr-ex-name" className="text-xs text-forge-muted block mb-1">Exercise or Event</label>
                <input
                  id="pr-ex-name"
                  type="text"
                  required
                  placeholder="e.g. Barbell Deadlift"
                  value={exerciseName}
                  onChange={e => setExerciseName(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>

              <div>
                <label htmlFor="pr-type" className="text-xs text-forge-muted block mb-1">Record Type</label>
                <select
                  id="pr-type"
                  value={prType}
                  onChange={e => setPRType(e.target.value as PersonalRecord['type'])}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
                >
                  <option value="heaviest_weight">Heaviest Weight Lifted</option>
                  <option value="estimated_1rm">Estimated 1RM</option>
                  <option value="max_reps">Maximum Repetitions</option>
                  <option value="fastest_run">Fastest Run</option>
                  <option value="longest_run">Longest Run</option>
                  <option value="best_volume">Best Single Workout Volume</option>
                </select>
              </div>

              <div>
                <label htmlFor="pr-raw-val" className="text-xs text-forge-muted block mb-1">Numeric Value (kg, seconds, reps)</label>
                <input
                  id="pr-raw-val"
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 180"
                  value={prValue}
                  onChange={e => setPRValue(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>

              <div>
                <label htmlFor="pr-formatted-val" className="text-xs text-forge-muted block mb-1">Formatted Display Label</label>
                <input
                  id="pr-formatted-val"
                  type="text"
                  placeholder="e.g. 180.0 kg (3 reps)"
                  value={prFormatted}
                  onChange={e => setPRFormatted(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-forge-accent text-white font-bold text-xs shadow-lg shadow-forge-accent/25 transition-all mt-2"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
