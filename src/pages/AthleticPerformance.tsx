import React, { useState } from 'react';
import { Flame, Plus, Trash2 } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const AthleticPerformance: React.FC = () => {
  const { athleticTests, saveAthleticTest, deleteAthleticTest, profile } = useFitness();

  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState<'Speed' | 'Power' | 'Endurance' | 'Strength' | 'Mobility'>('Power');
  const [unit, setUnit] = useState('cm');
  const [value, setValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(value);
    if (!testName.trim() || !v) return;

    saveAthleticTest({
      userId: profile.id,
      testName: testName.trim(),
      category,
      unit,
      value: v,
      date: new Date().toISOString().split('T')[0]
    });

    setTestName('');
    setValue('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {athleticTests.map(t => (
          <div key={t.id} className="bg-forge-surface border border-forge-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-forge-accent uppercase tracking-wider bg-forge-accent/10 px-2 py-0.5 rounded border border-forge-accent/30">
                {t.category}
              </span>
              <h4 className="text-base font-black text-white mt-2">{t.testName}</h4>
              <p className="text-2xl font-black text-forge-success mt-1">
                {t.value} <span className="text-xs text-forge-muted font-normal">{t.unit}</span>
              </p>
              <p className="text-[10px] text-forge-muted mt-1">Tested on: {t.date}</p>
            </div>
            <button
              onClick={() => deleteAthleticTest(t.id)}
              aria-label={`Delete test ${t.testName}`}
              className="text-forge-muted hover:text-forge-danger transition-colors p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {athleticTests.length === 0 && (
          <div className="col-span-full py-12 text-center text-forge-muted text-xs bg-forge-surface border border-forge-border rounded-xl">
            No athletic conditioning tests recorded. Add your first benchmark below.
          </div>
        )}
      </div>

      {/* New test form */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Record Conditioning Benchmark</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label htmlFor="test-name" className="text-xs text-forge-muted block mb-1">Test Name</label>
            <input
              id="test-name"
              type="text"
              required
              placeholder="e.g. 100m Sprint"
              value={testName}
              onChange={e => setTestName(e.target.value)}
              className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
            />
          </div>
          <div>
            <label htmlFor="test-category" className="text-xs text-forge-muted block mb-1">Category</label>
            <select
              id="test-category"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
            >
              <option value="Speed">Speed</option>
              <option value="Power">Power</option>
              <option value="Endurance">Endurance</option>
              <option value="Strength">Strength</option>
              <option value="Mobility">Mobility</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-forge-muted block mb-1">Unit & Score</label>
            <div className="flex gap-2">
              <input
                type="text"
                aria-label="Test unit"
                placeholder="s, cm"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-16 bg-forge-card border border-forge-border rounded-lg px-2 py-2 text-white text-xs outline-none"
              />
              <input
                type="number"
                step="0.1"
                required
                aria-label="Test score value"
                placeholder="Score"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="flex-1 bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Add Benchmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
