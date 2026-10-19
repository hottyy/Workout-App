import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const TrainingCalendar: React.FC = () => {
  const { calendarSessions, toggleCalendarSession, addCalendarSession } = useFitness();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'workout' | 'run' | 'mobility' | 'rest'>('workout');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarSession({
      date,
      title: title.trim(),
      type,
      completed: false
    });
    setTitle('');
  };

  const completedCount = calendarSessions.filter(s => s.completed).length;
  const adherenceRate = calendarSessions.length > 0 
    ? Math.round((completedCount / calendarSessions.length) * 100) 
    : 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Adherence Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Planned Sessions</span>
          <div className="text-2xl font-black text-white mt-1">{calendarSessions.length}</div>
        </div>
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Completed</span>
          <div className="text-2xl font-black text-forge-success mt-1">{completedCount}</div>
        </div>
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <span className="text-xs text-forge-muted uppercase font-semibold">Adherence Rate</span>
          <div className="text-2xl font-black text-forge-accent mt-1">{adherenceRate}%</div>
        </div>
      </div>

      <div className="bg-forge-surface border border-forge-border rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-3">Planned Training Schedule</h3>

        <div className="space-y-3">
          {calendarSessions.map(sess => (
            <div 
              key={sess.id}
              onClick={() => toggleCalendarSession(sess.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleCalendarSession(sess.id); }}
              aria-label={`Toggle session ${sess.title}`}
              className="p-3.5 bg-forge-card border border-forge-border rounded-xl flex items-center justify-between cursor-pointer hover:bg-forge-border/40 select-none transition-colors"
            >
              <div className="flex items-center gap-3">
                {sess.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-forge-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-forge-muted shrink-0" />
                )}
                <div>
                  <h4 className={`text-xs font-bold ${sess.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {sess.title}
                  </h4>
                  <span className="text-[10px] text-forge-muted uppercase tracking-wider">{sess.date} • {sess.type}</span>
                </div>
              </div>

              <span className={`text-[10px] font-semibold ${sess.completed ? 'text-forge-success' : 'text-forge-accent'}`}>
                {sess.completed ? 'Completed' : 'Tap to Complete'}
              </span>
            </div>
          ))}

          {calendarSessions.length === 0 && (
            <p className="py-6 text-center text-forge-muted text-xs">
              No planned sessions. Add scheduled workouts or rest days below.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleAdd} className="mt-6 pt-4 border-t border-forge-border flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
          />
          <input
            type="text"
            required
            placeholder="Session title (e.g. Upper Body Hypertrophy)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value as any)}
            className="bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
          >
            <option value="workout">Workout</option>
            <option value="run">Cardio Run</option>
            <option value="mobility">Mobility</option>
            <option value="rest">Rest Day</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Schedule
          </button>
        </form>
      </div>
    </div>
  );
};
