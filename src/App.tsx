// src/App.tsx
import React from 'react';
import { useCarbonStore } from './store/useCarbonStore';
import { OnboardingForm } from './features/onboarding/OnboardingForm';
import { ActionList } from './features/activities/ActionList';
import { FootprintChart } from './features/dashboard/FootprintChart';

function App() {
  const isBoarded = useCarbonStore((state) => state.isBoarded);
  const baselineCo2 = useCarbonStore((state) => state.baselineCo2);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Carbon Footprint Tracker</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Understand, track, and reduce your environmental impact.
          </p>
        </header>

        <main>
          {!isBoarded ? (
            <OnboardingForm />
          ) : (
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-green-500">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Annual Baseline</h2>
                  <p className="text-sm text-gray-500">Based on your initial survey</p>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {baselineCo2.toFixed(0)} kg CO₂e
                </div>
              </section>
              
              <ActionList />
              <FootprintChart />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
