import React from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, Scale, 
  Activity, Dumbbell, HeartPulse, Sparkles, ChevronRight 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { calculateBMI, getBMICategory } from '../utils/calculations';

export const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { workouts, runs, bodyMetrics, prs, wellnessLogs, profile, loadSampleData } = useFitness();

  const hasData = workouts.length > 0 || runs.length > 0 || bodyMetrics.length > 0;

  // Real calculations
  const latestMetric = bodyMetrics[0];
  const currentWeight = latestMetric ? latestMetric.weightKg : null;
  const currentBMI = currentWeight ? calculateBMI(currentWeight, profile.heightCm) : 0;
  const bmiInfo = getBMICategory(currentBMI);

  // Weight change over 30 days
  let weightDelta30d: number | null = null;
  if (bodyMetrics.length > 1) {
    const oldestMetric = bodyMetrics[bodyMetrics.length - 1];
    weightDelta30d = Math.round((latestMetric.weightKg - oldestMetric.weightKg) * 10) / 10;
  }

  // Workouts & running this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const workoutsThisWeek = workouts.filter(w => new Date(w.startTime) >= oneWeekAgo).length;
  const runningDistanceThisWeek = Math.round(
    runs
      .filter(r => new Date(r.date) >= oneWeekAgo)
      .reduce((acc, curr) => acc + curr.distanceKm, 0) * 10
  ) / 10;

  const totalVolumeThisWeek = Math.round(
    workouts
      .filter(w => new Date(w.startTime) >= oneWeekAgo)
      .reduce((acc, curr) => acc + curr.totalVolumeKg, 0)
  );

  // Weight Trend Data for Recharts sorted chronologically
  const weightChartData = [...bodyMetrics]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: m.date.slice(5),
      weight: m.weightKg
    }));

  // Latest wellness
  const latestWellness = wellnessLogs[0];

  return (
    <div className="space-y-6">
      {/* Onboarding State if empty */}
      {!hasData && (
        <div className="p-8 rounded-2xl bg-forge-card border border-forge-accent/30 text-center relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forge-accent/20 border border-forge-accent flex items-center justify-center mx-auto text-forge-accent">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Welcome to FORGE Athletic OS</h3>
            <p className="text-xs text-forge-muted leading-relaxed">
              Your command center has no recorded activity yet. You can start logging your real training now, or populate an athletic demo dataset to explore the full telemetry suite immediately.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={loadSampleData}
                aria-label="Load Sample Dataset"
                className="px-4 py-2 rounded-lg bg-forge-accent hover:bg-blue-600 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-forge-accent/20"
              >
                Load Athletic Sample Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Body Weight */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <div className="flex items-center justify-between text-forge-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Weight</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{currentWeight ? `${currentWeight} kg` : '--'}</span>
            {weightDelta30d !== null && (
              <span className={`text-xs font-bold flex items-center ${weightDelta30d <= 0 ? 'text-forge-success' : 'text-amber-400'}`}>
                {weightDelta30d <= 0 ? <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" /> : <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" />}
                {Math.abs(weightDelta30d)} kg
              </span>
            )}
          </div>
          <p className="text-[11px] text-forge-muted mt-1 truncate">
            {profile.weightGoalKg ? `Target: ${profile.weightGoalKg} kg` : 'Daily rolling tracking'}
          </p>
        </div>

        {/* Metric 2: Workouts This Week */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <div className="flex items-center justify-between text-forge-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Strength Days</span>
            <Dumbbell className="w-4 h-4 text-forge-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{workoutsThisWeek}</span>
            <span className="text-xs text-forge-muted">/ {profile.weeklyWorkoutTarget} target</span>
          </div>
          <div className="w-full bg-forge-card h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-forge-accent h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (workoutsThisWeek / profile.weeklyWorkoutTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Running Mileage */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <div className="flex items-center justify-between text-forge-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Run Mileage</span>
            <Activity className="w-4 h-4 text-forge-success" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{runningDistanceThisWeek}</span>
            <span className="text-xs text-forge-muted">km this week</span>
          </div>
          <p className="text-[11px] text-forge-muted mt-1 truncate">
            Target: {profile.weeklyRunningDistanceTargetKm} km
          </p>
        </div>

        {/* Metric 4: PRs Count */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <div className="flex items-center justify-between text-forge-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active PRs</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{prs.length}</span>
            <span className="text-xs font-bold text-forge-success">Verified</span>
          </div>
          <p className="text-[11px] text-forge-muted mt-1 truncate">
            Epley 1RM & Benchmark logs
          </p>
        </div>
      </div>

      {/* Charts and Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Trend Chart */}
        <div className="lg:col-span-2 bg-forge-surface border border-forge-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Weight Trajectory</h3>
              <p className="text-xs text-forge-muted">Real weigh-ins recorded</p>
            </div>
            <button 
              onClick={() => onNavigate('body_metrics')}
              aria-label="Navigate to Body Metrics"
              className="text-xs text-forge-accent hover:underline flex items-center font-semibold"
            >
              Metrics Hub <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            {weightChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightChartData}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748B" tick={{ fontSize: 11 }} unit="kg" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181E26', borderColor: '#232B36', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-forge-muted text-xs">
                No weigh-ins recorded. Add your first measurement in Body Composition.
              </div>
            )}
          </div>
        </div>

        {/* Wellness & Recovery Readiness */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">Wellness Status</h3>
              <HeartPulse className="w-4 h-4 text-forge-accent" />
            </div>

            {latestWellness ? (
              <div className="space-y-4">
                <div className="bg-forge-card border border-forge-border p-3.5 rounded-lg">
                  <div className="flex justify-between text-xs">
                    <span className="text-forge-muted">Sleep Recorded</span>
                    <span className="text-white font-bold">{latestWellness.sleepDurationHours} hrs</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-forge-muted">Energy Score</span>
                    <span className="text-forge-success font-bold">{latestWellness.energyLevel} / 5</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-forge-muted">Soreness Level</span>
                    <span className="text-amber-400 font-bold">{latestWellness.sorenessLevel} / 5</span>
                  </div>
                </div>

                <div className="text-[11px] text-forge-muted leading-relaxed">
                  Wellness markers are subjective indicators to guide autoregulation and rest intervals. They do not substitute medical advice.
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-forge-muted text-xs">
                No wellness check-in logged today.
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('recovery')}
            aria-label="Open Recovery Log"
            className="w-full mt-4 py-2 rounded-lg bg-forge-card hover:bg-forge-border border border-forge-border text-xs font-semibold text-white transition-colors"
          >
            Open Recovery Log
          </button>
        </div>
      </div>

      {/* Recent Activity Timeline & PR Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Recent Training Sessions</h3>
            <button 
              onClick={() => onNavigate('workout_history')}
              aria-label="View All Workouts"
              className="text-xs text-forge-accent hover:underline flex items-center font-semibold"
            >
              View All ({workouts.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {workouts.slice(0, 3).map(w => (
              <div key={w.id} className="p-3 bg-forge-card border border-forge-border rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{w.name}</h4>
                  <p className="text-[11px] text-forge-muted">
                    {new Date(w.startTime).toLocaleDateString()} • {Math.round(w.durationSeconds / 60)} min • {w.sessions.length} exercises
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-forge-accent">{w.totalVolumeKg} kg</span>
                  <p className="text-[10px] text-forge-muted">Volume</p>
                </div>
              </div>
            ))}

            {workouts.length === 0 && (
              <p className="text-xs text-forge-muted py-6 text-center">No workout sessions logged yet.</p>
            )}
          </div>
        </div>

        {/* Recent PR Feed */}
        <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide">Verified Personal Records</h3>
            <button 
              onClick={() => onNavigate('prs')}
              aria-label="View PR Hall of Fame"
              className="text-xs text-forge-accent hover:underline flex items-center font-semibold"
            >
              PR Hall of Fame <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {prs.slice(0, 3).map(pr => (
              <div key={pr.id} className="p-3 bg-forge-card border border-forge-border rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <h4 className="text-xs font-bold text-white">{pr.exerciseName}</h4>
                  </div>
                  <p className="text-[10px] text-forge-muted mt-0.5 capitalize">{pr.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-forge-success">{pr.formattedValue}</span>
                  <p className="text-[10px] text-forge-muted">{pr.date}</p>
                </div>
              </div>
            ))}

            {prs.length === 0 && (
              <p className="text-xs text-forge-muted py-6 text-center">No personal records established yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
