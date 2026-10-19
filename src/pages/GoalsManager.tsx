import React, { useState } from 'react';
import { Target, CheckCircle2, Plus } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const GoalsManager: React.FC = () => {
  const { goals, saveGoal, updateGoalStatus, profile } = useFitness();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'weight' | 'strength' | 'distance'>('weight');
  const [startVal, setStartVal] = useState('85.5');
  const [currentVal, setCurrentVal] = useState('83.2');
  const [targetVal, setTargetVal] = useState('82.0');
  const [unit, setUnit] = useState('kg');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveGoal({
      userId: profile.id,
      title: title.trim(),
      category,
      startValue: parseFloat(startVal) || 0,
      currentValue: parseFloat(currentVal) || 0,
      targetValue: parseFloat(targetVal) || 0,
      unit,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });

    setTitle('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(g => {
          const totalDelta = Math.abs(g.targetValue - g.startValue);
          const currentDelta = Math.abs(g.currentValue - g.startValue);
          const pct = totalDelta > 0 ? Math.min(100, Math.round((currentDelta / totalDelta) * 100)) : 100;

          return (
            <div key={g.id} className="bg-forge-surface border border-forge-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-forge-accent uppercase tracking-wider bg-forge-accent/10 px-2 py-0.5 rounded border border-forge-accent/30">
                  {g.category}
                </span>
                <span className={`text-xs font-bold ${g.status === 'completed' ? 'text-forge-success' : 'text-forge-accent'}`}>
                  {g.status === 'completed' ? 'Achieved 100%' : `${pct}%`}
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{g.title}</h4>
              <p className="text-xs text-forge-muted mt-1">
                Current: <strong className="text-white">{g.currentValue} {g.unit}</strong> • Target: {g.targetValue} {g.unit}
              </p>

              <div className="w-full bg-forge-card h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${g.status === 'completed' ? 'bg-forge-success' : 'bg-forge-accent'}`}
                  style={{ width: `${g.status === 'completed' ? 100 : pct}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-forge-border/40">
                <span className="text-[10px] text-forge-muted">Started: {g.startDate}</span>
                <button
                  onClick={() => updateGoalStatus(g.id, g.status === 'completed' ? 'active' : 'completed')}
                  className="text-xs text-forge-accent hover:underline font-semibold"
                >
                  {g.status === 'completed' ? 'Re-open Goal' : 'Mark Achieved'}
                </button>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center text-forge-muted text-xs bg-forge-surface border border-forge-border rounded-xl">
            No active targets set. Create your first measurable milestone below.
          </div>
        )}
      </div>

      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Create Target Milestone</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label htmlFor="goal-title" className="text-xs text-forge-muted block mb-1">Milestone Title</label>
            <input
              id="goal-title"
              type="text"
              required
              placeholder="e.g. Sub-25 5K Run, or 120kg Bench 1RM"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label htmlFor="goal-start" className="text-xs text-forge-muted block mb-1">Start</label>
              <input
                id="goal-start"
                type="number"
                step="0.1"
                placeholder="Start"
                value={startVal}
                onChange={e => setStartVal(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              />
            </div>
            <div>
              <label htmlFor="goal-curr" className="text-xs text-forge-muted block mb-1">Current</label>
              <input
                id="goal-curr"
                type="number"
                step="0.1"
                placeholder="Current"
                value={currentVal}
                onChange={e => setCurrentVal(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              />
            </div>
            <div>
              <label htmlFor="goal-target" className="text-xs text-forge-muted block mb-1">Target</label>
              <input
                id="goal-target"
                type="number"
                step="0.1"
                placeholder="Target"
                value={targetVal}
                onChange={e => setTargetVal(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              />
            </div>
            <div>
              <label htmlFor="goal-unit" className="text-xs text-forge-muted block mb-1">Unit</label>
              <input
                id="goal-unit"
                type="text"
                placeholder="kg, s, reps"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs rounded-lg mt-2 transition-colors"
          >
            Create Goal
          </button>
        </form>
      </div>
    </div>
  );
};
