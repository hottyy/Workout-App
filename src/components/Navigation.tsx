import React from 'react';
import { 
  LayoutDashboard, Dumbbell, History, BookOpen, 
  Trophy, Scale, Activity, Flame, HeartPulse, 
  CalendarDays, Target, BarChart3, Settings, PlusCircle 
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenQuickAction: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onNavigate,
  onOpenQuickAction 
}) => {
  const primaryNavItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'start_workout', label: 'Start Workout', icon: Dumbbell, highlight: true },
    { id: 'workout_history', label: 'Workout Log', icon: History },
    { id: 'exercise_library', label: 'Exercise Library', icon: BookOpen },
    { id: 'prs', label: 'Personal Records', icon: Trophy },
    { id: 'body_metrics', label: 'Body Composition', icon: Scale },
    { id: 'running', label: 'Run & Cardio', icon: Activity },
    { id: 'performance', label: 'Athletic Tests', icon: Flame },
    { id: 'recovery', label: 'Sleep & Recovery', icon: HeartPulse },
    { id: 'calendar', label: 'Training Calendar', icon: CalendarDays },
    { id: 'goals', label: 'Goals & Targets', icon: Target },
    { id: 'analytics', label: 'Analytics Lab', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workout_history', label: 'History', icon: History },
    { id: 'start_workout', label: 'Train', icon: Dumbbell, highlight: true },
    { id: 'running', label: 'Runs', icon: Activity },
    { id: 'body_metrics', label: 'Metrics', icon: Scale },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        aria-label="Desktop navigation"
        className="hidden lg:flex flex-col w-64 bg-forge-surface border-r border-forge-border fixed top-0 bottom-0 left-0 z-30 select-none"
      >
        {/* Brand */}
        <div className="p-5 border-b border-forge-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-forge-accent shadow-[0_0_12px_rgba(37,99,235,0.8)]"></span>
            <div>
              <h1 className="font-black text-xl tracking-wider text-white">FORGE</h1>
              <p className="text-[10px] text-forge-muted tracking-tight font-medium">ATHLETIC PERFORMANCE OS</p>
            </div>
          </div>
          <button 
            onClick={onOpenQuickAction}
            title="Quick Action"
            aria-label="Quick action log"
            className="p-1.5 rounded-lg bg-forge-card hover:bg-forge-accent text-forge-muted hover:text-white transition-colors border border-forge-border"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Links list */}
        <nav aria-label="Main menu" className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-forge-accent text-white shadow-lg shadow-forge-accent/20' 
                    : item.highlight 
                      ? 'text-forge-accent hover:bg-forge-accent/10 border border-forge-accent/30' 
                      : 'text-gray-400 hover:text-white hover:bg-forge-card'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-forge-accent' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card footer */}
        <div className="p-4 border-t border-forge-border/60 bg-forge-surface">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-forge-card border border-forge-border flex items-center justify-center font-bold text-xs text-forge-accent">
              MV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Marcus Vance</p>
              <p className="text-[10px] text-forge-success font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-success"></span> Local Storage Synced
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav 
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-forge-surface/95 backdrop-blur-md border-t border-forge-border z-40 px-2 py-2 flex items-center justify-around"
      >
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                isActive ? 'text-forge-accent' : 'text-forge-muted hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
