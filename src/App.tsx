// src/App.tsx
import { useRef, useState, useEffect } from 'react';
import { useCarbonStore } from './store/useCarbonStore';
import { OnboardingForm } from './features/onboarding/OnboardingForm';
import { ActionList } from './features/activities/ActionList';
import { FootprintChart } from './features/dashboard/FootprintChart';
import { Chatbot } from './features/chatbot/Chatbot';
import { Download, Upload, Moon, Sun } from 'lucide-react';
import { announce } from './utils/ariaAnnouncer';

function App() {
  const isBoarded = useCarbonStore((state) => state.isBoarded);
  const baselineCo2 = useCarbonStore((state) => state.baselineCo2);
  const exportData = useCarbonStore((state) => state.exportData);
  const importData = useCarbonStore((state) => state.importData);
  const resetData = useCarbonStore((state) => state.resetData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    announce(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode.`);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carbon-footprint-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    announce("Data exported successfully.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your data? This cannot be undone unless you have an exported backup.")) {
      resetData();
      announce("All data has been reset.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target?.result as string);
      if (success) {
        announce("Data imported successfully.");
      } else {
        announce("Failed to import data. Invalid file format.");
        alert("Failed to import data. Please ensure it is a valid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-gray-100' : 'bg-gradient-to-br from-green-300 via-teal-200 to-emerald-400 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto space-y-8 relative">
        
        {/* Utilities Bar */}
        <div className="absolute top-0 right-0 flex gap-2 flex-wrap justify-end">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-1 text-sm bg-white/40 dark:bg-slate-800/80 backdrop-blur-md border border-white/30 dark:border-slate-700 text-teal-900 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-md"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 text-sm bg-red-500/80 dark:bg-red-600/80 backdrop-blur-md border border-red-500/30 text-white px-3 py-1.5 rounded-full hover:bg-red-500 dark:hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 shadow-md"
            aria-label="Reset all data"
          >
            Reset
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1 text-sm bg-white/40 dark:bg-slate-800/80 backdrop-blur-md border border-white/30 dark:border-slate-700 text-teal-900 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-md"
            aria-label="Export data to JSON"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleImportClick}
            className="flex items-center gap-1 text-sm bg-white/40 dark:bg-slate-800/80 backdrop-blur-md border border-white/30 dark:border-slate-700 text-teal-900 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-white/60 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-md"
            aria-label="Import data from JSON"
          >
            <Upload size={16} /> Import
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            aria-hidden="true" 
          />
        </div>

        <header className="text-center pt-12 sm:pt-8">
          <h1 className="text-4xl font-extrabold text-teal-900 dark:text-teal-400 drop-shadow-sm transition-colors">Carbon Footprint Tracker</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-teal-800 dark:text-gray-300 drop-shadow-sm transition-colors">
            Understand, track, and reduce your environmental impact.
          </p>
        </header>

        <main>
          {!isBoarded ? (
            <OnboardingForm />
          ) : (
            <div className="space-y-6">
              <section className="bg-white/40 dark:bg-slate-800/60 backdrop-blur-lg border border-white/40 dark:border-slate-700 p-6 rounded-2xl shadow-xl flex items-center justify-between transition-colors">
                <div>
                  <h2 className="text-lg font-bold text-teal-900 dark:text-teal-400">Annual Baseline</h2>
                  <p className="text-sm text-teal-800 dark:text-gray-400">Based on your initial survey</p>
                </div>
                <div className="text-3xl font-black text-teal-700 dark:text-teal-300 drop-shadow-sm transition-colors">
                  {baselineCo2.toFixed(0)} kg CO₂e
                </div>
              </section>
              
              <ActionList />
              <FootprintChart isDarkMode={isDarkMode} />
            </div>
          )}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
