import React, { useState } from 'react';
import { Moon, Sun, Waves, BarChart3, Clock, FileDown, Target } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TimesTracker } from './components/TimesTracker';
import { TrainingLog } from './components/TrainingLog';
import { ExportData } from './components/ExportData';
import { Goals } from './components/Goals';
import { useTheme } from './hooks/useTheme';

type Tab = 'dashboard' | 'times' | 'training' | 'goals' | 'export';

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
  { id: 'times' as Tab, label: 'Swimming Times', icon: Clock },
  { id: 'training' as Tab, label: 'Training Log', icon: Waves },
  { id: 'goals' as Tab, label: 'Goals', icon: Target },
  { id: 'export' as Tab, label: 'Export Data', icon: FileDown },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { isDark, toggleTheme } = useTheme();

  const handleQuickTime = (stroke: string, distance: number) => {
    setActiveTab('times');
  };

  const handleQuickWorkout = (type: string) => {
    setActiveTab('training');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onQuickTime={handleQuickTime} onQuickWorkout={handleQuickWorkout} />;
      case 'times':
        return <TimesTracker />;
      case 'training':
        return <TrainingLog />;
      case 'goals':
        return <Goals />;
      case 'export':
        return <ExportData />;
      default:
        return <Dashboard onQuickTime={handleQuickTime} onQuickWorkout={handleQuickWorkout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AquaTrack</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Swimming Performance Tracker</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;