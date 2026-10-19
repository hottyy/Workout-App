import React, { useState } from 'react';
import { Activity, Plus, Trash2, MapPin, Gauge } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { formatPace, formatDuration, calculateSpeedKmh } from '../utils/calculations';
import { RunType } from '../types';

export const RunningTracker: React.FC = () => {
  const { runs, saveRun, deleteRun, profile } = useFitness();

  const [distInput, setDistInput] = useState('');
  const [minInput, setMinInput] = useState('');
  const [secInput, setSecInput] = useState('0');
  const [runType, setRunType] = useState<RunType>('easy');
  const [isGps, setIsGps] = useState(false);
  const [notes, setNotes] = useState('');

  // Total mileage calculations
  const totalDistance = Math.round(runs.reduce((a, b) => a + b.distanceKm, 0) * 10) / 10;
  const longestRun = runs.length > 0 ? Math.max(...runs.map(r => r.distanceKm)) : 0;

  const handleLogRun = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(distInput);
    const m = parseInt(minInput, 10) || 0;
    const s = parseInt(secInput, 10) || 0;
    const totalSec = m * 60 + s;

    if (!d || d <= 0 || totalSec <= 0) return;

    // Strict Pace in seconds per km: totalSec / d
    const paceSec = totalSec / d;
    const speedKmh = calculateSpeedKmh(d, totalSec);

    saveRun({
      userId: profile.id,
      date: new Date().toISOString().split('T')[0],
      distanceKm: d,
      durationSeconds: totalSec,
      avgPaceSecondsPerKm: paceSec,
      avgSpeedKmh: speedKmh,
      runType,
      isGpsTracked: isGps,
      routeNotes: notes
    });

    setDistInput('');
    setMinInput('');
    setSecInput('0');
    setNotes('');
  };

  const chartData = [...runs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(r => ({
      date: r.date.slice(5),
      distance: r.distanceKm
    }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Total Mileage</span>
          <div className="text-2xl font-black text-white mt-1">{totalDistance} km</div>
        </div>
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Completed Runs</span>
          <div className="text-2xl font-black text-forge-success mt-1">{runs.length}</div>
        </div>
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Longest Session</span>
          <div className="text-2xl font-black text-white mt-1">{longestRun} km</div>
        </div>
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Target Weekly</span>
          <div className="text-2xl font-black text-forge-accent mt-1">{profile.weeklyRunningDistanceTargetKm} km</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Distance History (km)</h3>
        <div className="h-56 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} unit="km" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181E26', borderColor: '#232B36', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="distance" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-forge-muted text-xs">
              No running sessions logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Entry & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Log Cardio Run</h3>
          <form onSubmit={handleLogRun} className="space-y-3">
            <div>
              <label htmlFor="run-dist" className="text-xs text-forge-muted block mb-1">Distance (km)*</label>
              <input
                id="run-dist"
                type="number"
                step="0.01"
                required
                placeholder="e.g. 5.0"
                value={distInput}
                onChange={e => setDistInput(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="run-min" className="text-xs text-forge-muted block mb-1">Minutes*</label>
                <input
                  id="run-min"
                  type="number"
                  required
                  placeholder="25"
                  value={minInput}
                  onChange={e => setMinInput(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>
              <div>
                <label htmlFor="run-sec" className="text-xs text-forge-muted block mb-1">Seconds</label>
                <input
                  id="run-sec"
                  type="number"
                  max="59"
                  placeholder="00"
                  value={secInput}
                  onChange={e => setSecInput(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="run-select-type" className="text-xs text-forge-muted block mb-1">Session Type</label>
              <select
                id="run-select-type"
                value={runType}
                onChange={e => setRunType(e.target.value as RunType)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
              >
                <option value="easy">Easy Base</option>
                <option value="tempo">Tempo Pace</option>
                <option value="interval">Interval Repeat</option>
                <option value="long">Long Run</option>
                <option value="recovery">Recovery Jog</option>
                <option value="race">Race Event</option>
                <option value="treadmill">Treadmill</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="gps-tracked-checkbox"
                type="checkbox"
                checked={isGps}
                onChange={e => setIsGps(e.target.checked)}
                className="accent-forge-accent"
              />
              <label htmlFor="gps-tracked-checkbox" className="text-xs text-forge-muted">
                GPS Recorded (Check only if GPS route was verified)
              </label>
            </div>

            <div>
              <label htmlFor="run-notes" className="text-xs text-forge-muted block mb-1">Route / Notes</label>
              <input
                id="run-notes"
                type="text"
                placeholder="e.g. Out & back lake route"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs mt-2"
            >
              Save Cardio Run
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-forge-surface border border-forge-border rounded-xl p-5 overflow-x-auto">
          <h3 className="text-sm font-bold text-white mb-3">Cardio Logs</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-forge-muted uppercase border-b border-forge-border">
                <th className="pb-2">Date</th>
                <th className="pb-2">Dist</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Pace (/km)</th>
                <th className="pb-2">Speed</th>
                <th className="pb-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-border/40">
              {runs.map(r => (
                <tr key={r.id}>
                  <td className="py-2.5 font-semibold text-white">{r.date}</td>
                  <td className="py-2.5 font-bold text-forge-success">{r.distanceKm} km</td>
                  <td className="py-2.5 font-mono">{formatDuration(r.durationSeconds)}</td>
                  <td className="py-2.5 font-mono">{formatPace(r.avgPaceSecondsPerKm)}</td>
                  <td className="py-2.5">{r.avgSpeedKmh} km/h</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => deleteRun(r.id)}
                      aria-label={`Delete run on ${r.date}`}
                      className="text-forge-muted hover:text-forge-danger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-forge-muted">
                    No cardio runs recorded yet.
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
