import React, { useState } from 'react';
import { Trash2, Calendar, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { formatDuration } from '../utils/calculations';

export const WorkoutHistory: React.FC = () => {
  const { workouts, deleteWorkout } = useFitness();
  const [expandedId, setExpandedId] = useState<string | null>(workouts[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.sessions.some(s => s.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Workout History ({workouts.length})</h3>
          <p className="text-xs text-forge-muted">Working-set volume strictly audited</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-forge-muted" />
          <input
            type="text"
            placeholder="Filter sessions or exercises..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-forge-surface border border-forge-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-forge-accent"
          />
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="p-8 bg-forge-surface border border-forge-border rounded-xl text-center text-xs text-forge-muted">
          {workouts.length === 0 ? 'No workout history logged. Record a session to see detailed set analyses here.' : 'No workouts match your filter.'}
        </div>
      ) : (
        filteredWorkouts.map(w => {
          const isExpanded = expandedId === w.id;
          return (
            <div key={w.id} className="bg-forge-surface border border-forge-border rounded-xl overflow-hidden transition-all">
              <div 
                onClick={() => toggleExpand(w.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(w.id); }}
                aria-expanded={isExpanded}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-forge-card/40 select-none"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{w.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-forge-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(w.startTime).toLocaleDateString()}
                    </span>
                    <span>• {formatDuration(w.durationSeconds)}</span>
                    <span className="text-forge-accent font-bold">{w.totalVolumeKg} kg volume</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm('Delete this workout permanently?')) {
                        deleteWorkout(w.id);
                      }
                    }}
                    aria-label={`Delete workout ${w.name}`}
                    className="p-1.5 text-forge-muted hover:text-forge-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-forge-muted" /> : <ChevronDown className="w-4 h-4 text-forge-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-forge-border/40 bg-forge-bg/30 space-y-3">
                  {w.sessions.map((sess, idx) => (
                    <div key={idx} className="bg-forge-card border border-forge-border/60 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white">{sess.exerciseName}</span>
                        <span className="text-[10px] text-forge-muted uppercase">{sess.category}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {sess.sets.map(s => (
                          <div key={s.id} className="bg-forge-surface px-2.5 py-1.5 rounded border border-forge-border/40 text-[11px]">
                            <span className="text-forge-muted">Set {s.setNumber}: </span>
                            <span className="font-bold text-white">{s.weight}kg × {s.reps}</span>
                            {s.rpe && <span className="text-forge-accent ml-1 font-semibold">@{s.rpe}</span>}
                            <span className="text-[9px] ml-1 text-forge-muted capitalize">({s.type})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {w.notes && (
                    <p className="text-[11px] text-forge-muted italic mt-2">Notes: {w.notes}</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
