import React, { useState } from 'react';
import { Search, Plus, BookOpen, X } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { MuscleGroup, EquipmentType } from '../types';

export const ExerciseLibrary: React.FC = () => {
  const { exercises, addCustomExercise } = useFitness();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New custom exercise state
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Chest');
  const [customEquipment, setCustomEquipment] = useState<EquipmentType>('Barbell');

  const muscleGroups: string[] = [
    'All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
    'Legs', 'Glutes', 'Core', 'Calves', 'Full body',
    'Olympic lifts', 'Calisthenics', 'Plyometrics', 'Mobility'
  ];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.category === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomExercise({
      name: customName.trim(),
      category: customMuscle,
      equipment: customEquipment
    });
    setCustomName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-exercise" className="sr-only">Search exercises</label>
          <Search className="w-4 h-4 absolute left-3 top-3 text-forge-muted" />
          <input
            id="search-exercise"
            type="text"
            placeholder="Search exercises by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-forge-surface border border-forge-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-forge-accent"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Add New Custom Exercise"
          className="px-4 py-2.5 rounded-xl bg-forge-accent hover:bg-blue-600 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-forge-accent/25"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Exercise</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Muscle Group Filters">
        {muscleGroups.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMuscle(m)}
            role="tab"
            aria-selected={selectedMuscle === m}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMuscle === m
                ? 'bg-forge-accent text-white'
                : 'bg-forge-surface border border-forge-border text-forge-muted hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-forge-surface border border-forge-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-forge-accent bg-forge-accent/10 px-2 py-0.5 rounded border border-forge-accent/30">
                  {ex.category}
                </span>
                <span className="text-[10px] text-forge-muted font-mono">{ex.equipment}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{ex.name}</h4>
            </div>
            {ex.isCustom && (
              <span className="text-[10px] text-forge-success font-semibold mt-3">Custom Athlete Entry</span>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-forge-muted text-xs bg-forge-surface border border-forge-border rounded-xl">
            No exercises match your filter.
          </div>
        )}
      </div>

      {/* Create Custom Modal */}
      {showAddModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="custom-ex-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-forge-surface border border-forge-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-forge-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 id="custom-ex-title" className="text-base font-bold text-white mb-4">Add Custom Exercise</h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label htmlFor="custom-name" className="text-xs text-forge-muted block mb-1">Exercise Name</label>
                <input
                  id="custom-name"
                  type="text"
                  required
                  placeholder="e.g. Deficit Trap Bar Deadlift"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-forge-accent"
                />
              </div>

              <div>
                <label htmlFor="custom-muscle" className="text-xs text-forge-muted block mb-1">Primary Muscle Target</label>
                <select
                  id="custom-muscle"
                  value={customMuscle}
                  onChange={e => setCustomMuscle(e.target.value as MuscleGroup)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
                >
                  {muscleGroups.filter(m => m !== 'All').map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="custom-equipment" className="text-xs text-forge-muted block mb-1">Equipment</label>
                <select
                  id="custom-equipment"
                  value={customEquipment}
                  onChange={e => setCustomEquipment(e.target.value as EquipmentType)}
                  className="w-full bg-forge-card border border-forge-border rounded-lg px-3 py-2 text-white text-xs outline-none"
                >
                  <option value="Barbell">Barbell</option>
                  <option value="Dumbbell">Dumbbell</option>
                  <option value="Cable">Cable</option>
                  <option value="Machine">Machine</option>
                  <option value="Bodyweight">Bodyweight</option>
                  <option value="Kettlebell">Kettlebell</option>
                  <option value="Cardio Equipment">Cardio Equipment</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg border border-forge-border text-xs text-forge-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-forge-accent text-white font-bold text-xs"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
