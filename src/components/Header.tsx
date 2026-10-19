import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenQuickAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenQuickAction }) => {
  const { loadSampleData } = useFitness();

  return (
    <header className="sticky top-0 z-20 bg-forge-bg/90 backdrop-blur-md border-b border-forge-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">{title}</h2>
        <p className="text-xs text-forge-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={loadSampleData}
          aria-label="Load Athletic Demo Dataset"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forge-border text-xs font-semibold text-gray-300 hover:text-white hover:bg-forge-card transition-colors"
          title="Populate athletic sample dataset for demonstration"
        >
          <Sparkles className="w-3.5 h-3.5 text-forge-accent" />
          <span>Load Athletic Demo</span>
        </button>

        <button
          onClick={onOpenQuickAction}
          aria-label="Record Activity"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-accent hover:bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-forge-accent/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Record Activity</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>
    </header>
  );
};
