import React from 'react';
import { Trophy, Check, X, Flame } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const PRModal: React.FC = () => {
  const { pendingPR, confirmPR, dismissPRAlert } = useFitness();

  if (!pendingPR) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="pr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-forge-surface border border-forge-accent/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="w-14 h-14 rounded-full bg-forge-accent/20 border border-forge-accent flex items-center justify-center mx-auto mb-4 text-forge-accent">
          <Trophy className="w-7 h-7" />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-forge-success bg-forge-success/10 px-2.5 py-0.5 rounded-full border border-forge-success/30 mb-2">
            <Flame className="w-3.5 h-3.5" /> NEW BENCHMARK DETECTED
          </div>
          <h3 id="pr-modal-title" className="text-lg font-black text-white">{pendingPR.exerciseName}</h3>
          <p className="text-xs text-forge-muted mt-1 capitalize">
            Record Type: {pendingPR.type.replace('_', ' ')}
          </p>

          <div className="bg-forge-card border border-forge-border rounded-xl p-4 my-4">
            <div className="text-2xl font-black text-white tracking-tight">{pendingPR.formattedText}</div>
            {pendingPR.oldValue && (
              <p className="text-xs text-forge-muted mt-1">
                Previous Best: <span className="text-gray-300 font-semibold">{pendingPR.oldValue}</span>
              </p>
            )}
            {pendingPR.formulaNote && (
              <p className="text-[11px] text-forge-muted mt-2 pt-2 border-t border-forge-border font-mono">
                {pendingPR.formulaNote} (Epley formula estimation, valid for ≤ 12 reps)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={dismissPRAlert}
            aria-label="Dismiss PR"
            className="flex-1 py-2.5 px-4 rounded-xl border border-forge-border text-xs font-semibold text-gray-400 hover:text-white hover:bg-forge-card transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Dismiss</span>
          </button>
          <button
            onClick={() => confirmPR({
              exerciseName: pendingPR.exerciseName,
              type: pendingPR.type,
              value: pendingPR.newValue,
              formattedValue: pendingPR.formattedText,
              previousValue: pendingPR.oldValue,
              date: new Date().toISOString().split('T')[0],
              formulaNote: pendingPR.formulaNote
            })}
            aria-label="Confirm and save PR"
            className="flex-1 py-2.5 px-4 rounded-xl bg-forge-accent hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-forge-accent/25 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Confirm PR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
