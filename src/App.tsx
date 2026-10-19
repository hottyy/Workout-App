import React, { useState } from 'react';
import { FitnessProvider } from './context/FitnessContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { PRModal } from './components/PRModal';
import { QuickActionModal } from './components/QuickActionModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { WorkoutHistory } from './pages/WorkoutHistory';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { PersonalRecords } from './pages/PersonalRecords';
import { BodyMetrics } from './pages/BodyMetrics';
import { RunningTracker } from './pages/RunningTracker';
import { AthleticPerformance } from './pages/AthleticPerformance';
import { RecoveryTracker } from './pages/RecoveryTracker';
import { TrainingCalendar } from './pages/TrainingCalendar';
import { GoalsManager } from './pages/GoalsManager';
import { Analytics } from './pages/Analytics';
import { ProfileSettings } from './pages/ProfileSettings';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Fitness Command Center', subtitle: 'Performance telemetry & daily status overview' },
    start_workout: { title: 'Active Workout Logger', subtitle: 'Real-time set volume, RPE & rest tracking' },
    workout_history: { title: 'Training Log History', subtitle: 'Chronological workout logs & set details' },
    exercise_library: { title: 'Exercise Library', subtitle: 'Biomechanical movement directory & custom lifts' },
    prs: { title: 'Personal Records', subtitle: 'Verified Epley 1RM benchmarks & endurance milestones' },
    body_metrics: { title: 'Body Composition', subtitle: 'Weigh-ins, circumference & adult BMI screening' },
    running: { title: 'Running & Cardio Hub', subtitle: 'Pace calculations, distances & cardio endurance' },
    performance: { title: 'Athletic Conditioning', subtitle: 'Sprint times, jump heights & benchmark fitness tests' },
    recovery: { title: 'Recovery & Readiness', subtitle: 'Subjective wellness, sleep autoregulation & soreness' },
    calendar: { title: 'Training Calendar', subtitle: 'Structured splits, adherence & planned sessions' },
    goals: { title: 'Targets & Milestones', subtitle: 'Measurable athletic targets & progression tracking' },
    analytics: { title: 'Performance Analytics Lab', subtitle: 'Volume distributions & historical performance trends' },
    settings: { title: 'Profile & Data Hub', subtitle: 'Athlete bio, targets & complete CSV/JSON export' },
  };

  const meta = pageMeta[currentPage] || pageMeta.dashboard;

  return (
    <div className="min-h-screen bg-forge-bg text-gray-100 font-sans flex flex-col selection:bg-forge-accent selection:text-white">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenQuickAction={() => setQuickActionOpen(true)}
      />

      {/* Main Content Area offset by desktop sidebar */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-24 lg:pb-8">
        <Header 
          title={meta.title} 
          subtitle={meta.subtitle} 
          onOpenQuickAction={() => setQuickActionOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8">
          {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
          {currentPage === 'start_workout' && <ActiveWorkout onFinish={() => setCurrentPage('workout_history')} />}
          {currentPage === 'workout_history' && <WorkoutHistory />}
          {currentPage === 'exercise_library' && <ExerciseLibrary />}
          {currentPage === 'prs' && <PersonalRecords />}
          {currentPage === 'body_metrics' && <BodyMetrics />}
          {currentPage === 'running' && <RunningTracker />}
          {currentPage === 'performance' && <AthleticPerformance />}
          {currentPage === 'recovery' && <RecoveryTracker />}
          {currentPage === 'calendar' && <TrainingCalendar />}
          {currentPage === 'goals' && <GoalsManager />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'settings' && <ProfileSettings />}
        </main>
      </div>

      {/* Global Modals */}
      <PRModal />
      <QuickActionModal 
        isOpen={quickActionOpen} 
        onClose={() => setQuickActionOpen(false)}
        onStartWorkoutNow={() => setCurrentPage('start_workout')}
      />
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <AppContent />
    </FitnessProvider>
  );
}
