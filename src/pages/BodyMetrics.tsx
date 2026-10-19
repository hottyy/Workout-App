import React, { useState } from 'react';
import { Scale, Info, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { calculateBMI, getBMICategory } from '../utils/calculations';

export const BodyMetrics: React.FC = () => {
  const { bodyMetrics, saveMetric, deleteMetric, profile } = useFitness();

  const [weightInput, setWeightInput] = useState('');
  const [waistInput, setWaistInput] = useState('');
  const [chestInput, setChestInput] = useState('');
  const [bodyFatInput, setBodyFatInput] = useState('');

  const currentMetric = bodyMetrics[0];
  const currentBmi = currentMetric ? calculateBMI(currentMetric.weightKg, profile.heightCm) : 0;
  const bmiBadge = getBMICategory(currentBmi);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(weightInput);
    if (!wt || wt <= 0) return;

    saveMetric({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      weightKg: wt,
      heightCm: profile.heightCm,
      waistCm: waistInput ? parseFloat(waistInput) : undefined,
      chestCm: chestInput ? parseFloat(chestInput) : undefined,
      bodyFatPercentage: bodyFatInput ? parseFloat(bodyFatInput) : undefined
    });

    setWeightInput('');
    setWaistInput('');
    setChestInput('');
    setBodyFatInput('');
  };

  const chartData = [...bodyMetrics]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: m.date.slice(5),
      weight: m.weightKg,
      waist: m.waistCm
    }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* BMI Scientific Context Callout */}
      <div className="p-4 bg-forge-card border border-forge-border rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-forge-accent shrink-0 mt-0.5" />
        <div className="text-xs text-forge-muted leading-relaxed">
          <strong className="text-white">Adult BMI Screening Context:</strong> BMI = weight(kg) / height(m)². Adult classifications serve strictly as epidemiological screening references. BMI does not measure body fat directly and can misclassify athletes with higher lean muscle mass.
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <span className="text-xs font-semibold uppercase text-forge-muted">Current Weight</span>
          <div className="text-3xl font-black text-white mt-1">
            {currentMetric ? `${currentMetric.weightKg} kg` : '--'}
          </div>
          <p className="text-[11px] text-forge-muted mt-1">
            Target Goal: <span className="text-white font-bold">{profile.weightGoalKg} kg</span>
          </p>
        </div>

        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <span className="text-xs font-semibold uppercase text-forge-muted">Calculated BMI</span>
          <div className="text-3xl font-black text-white mt-1">
            {currentBmi > 0 ? currentBmi : '--'}
          </div>
          <p className={`text-xs font-bold mt-1 ${bmiBadge.color}`}>
            {bmiBadge.label} ({bmiBadge.description})
          </p>
        </div>

        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <span className="text-xs font-semibold uppercase text-forge-muted">Body Fat Estimate</span>
          <div className="text-3xl font-black text-white mt-1">
            {currentMetric?.bodyFatPercentage ? `${currentMetric.bodyFatPercentage}%` : '--'}
          </div>
          <p className="text-[11px] text-forge-muted mt-1">Direct user measurement / DEXA</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Bodyweight Progression</h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#64748B" tick={{ fontSize: 11 }} unit="kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181E26', borderColor: '#232B36', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-forge-muted text-xs">
              No measurements logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Entry Form & Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Record Weigh-in</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label htmlFor="input-weight" className="text-xs text-forge-muted block mb-1">Bodyweight (kg)*</label>
              <input
                id="input-weight"
                type="number"
                step="0.1"
                required
                placeholder="e.g. 82.5"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="input-waist" className="text-xs text-forge-muted block mb-1">Waist Circumference (cm)</label>
              <input
                id="input-waist"
                type="number"
                step="0.5"
                placeholder="e.g. 83.5"
                value={waistInput}
                onChange={e => setWaistInput(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="input-chest" className="text-xs text-forge-muted block mb-1">Chest Circumference (cm)</label>
              <input
                id="input-chest"
                type="number"
                step="0.5"
                placeholder="e.g. 108"
                value={chestInput}
                onChange={e => setChestInput(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>
            <div>
              <label htmlFor="input-bodyfat" className="text-xs text-forge-muted block mb-1">Body Fat % (Optional)</label>
              <input
                id="input-bodyfat"
                type="number"
                step="0.1"
                placeholder="e.g. 14.0"
                value={bodyFatInput}
                onChange={e => setBodyFatInput(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-forge-accent text-white font-bold text-xs mt-2"
            >
              Add Measurement
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-forge-surface border border-forge-border rounded-xl p-5 overflow-x-auto">
          <h3 className="text-sm font-bold text-white mb-3">Measurement History</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-forge-muted uppercase border-b border-forge-border">
                <th className="pb-2">Date</th>
                <th className="pb-2">Weight</th>
                <th className="pb-2">BMI</th>
                <th className="pb-2">Waist</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-border/40">
              {bodyMetrics.map(m => (
                <tr key={m.id}>
                  <td className="py-2.5 font-semibold text-white">{m.date}</td>
                  <td className="py-2.5 font-bold text-forge-accent">{m.weightKg} kg</td>
                  <td className="py-2.5">{m.bmi}</td>
                  <td className="py-2.5">{m.waistCm ? `${m.waistCm} cm` : '--'}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => deleteMetric(m.id)}
                      aria-label={`Delete measurement for ${m.date}`}
                      className="text-forge-muted hover:text-forge-danger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {bodyMetrics.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-forge-muted">
                    No weigh-in logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
