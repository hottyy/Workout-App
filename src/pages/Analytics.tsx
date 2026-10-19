import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { calculateWorkingVolume } from '../utils/calculations';

export const Analytics: React.FC = () => {
  const { workouts, runs } = useFitness();
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'all'>('30d');

  // Filter workouts by selected timeframe
  const filteredWorkouts = workouts.filter(w => {
    if (timeframe === 'all') return true;
    const days = timeframe === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(w.startTime) >= cutoff;
  });

  // Calculate volume distribution by muscle group strictly across working sets
  const muscleDistribution: Record<string, number> = {};
  filteredWorkouts.forEach(w => {
    w.sessions.forEach(s => {
      const catVolume = calculateWorkingVolume(s.sets);
      muscleDistribution[s.category] = (muscleDistribution[s.category] || 0) + catVolume;
    });
  });

  const muscleData = Object.entries(muscleDistribution).map(([category, volume]) => ({
    category,
    volume
  }));

  const workoutVolumeData = filteredWorkouts.slice(0, 8).reverse().map(w => ({
    name: w.name.length > 12 ? w.name.slice(0, 12) + '...' : w.name,
    volume: w.totalVolumeKg
  }));

  const totalFilteredVolume = filteredWorkouts.reduce((acc, w) => acc + w.totalVolumeKg, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Performance Analytics</h3>
          <p className="text-xs text-forge-muted">
            Audited training volume across {filteredWorkouts.length} sessions ({totalFilteredVolume.toLocaleString()} kg total)
          </p>
        </div>
        <div className="flex gap-2">
          {(['30d', '90d', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              aria-label={`Select timeframe ${t}`}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                timeframe === t ? 'bg-forge-accent text-white' : 'bg-forge-surface border border-forge-border text-forge-muted hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Volume */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <h4 className="text-sm font-bold text-white mb-1">Session Volume (kg)</h4>
          <p className="text-[11px] text-forge-muted mb-4">Sum of weight × repetitions for completed working sets</p>
          <div className="h-64 w-full">
            {workoutVolumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutVolumeData}>
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181E26', borderColor: '#232B36', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-forge-muted">
                No session volume recorded in this timeframe.
              </div>
            )}
          </div>
        </div>

        {/* Muscle group distribution */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <h4 className="text-sm font-bold text-white mb-1">Volume by Muscle Group (kg)</h4>
          <p className="text-[11px] text-forge-muted mb-4">Hypertrophy volume loading across target biomechanical groups</p>
          <div className="h-64 w-full">
            {muscleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleData} layout="vertical">
                  <XAxis type="number" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="category" type="category" stroke="#64748B" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181E26', borderColor: '#232B36', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="volume" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-forge-muted">
                No muscle group distribution recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
